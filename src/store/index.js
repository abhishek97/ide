/**
 * Created by abhishek on 14/06/17.
 */
'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import base64 from 'base-64'
import samples from '../assets/js/sample-source'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    code: samples['C++'],
    language: 'C++',
    theme: 'dawn',
    font: 'Dawn',
    fontSize: 12,
    showCustomInput: 'false',
    showSettings: false,
    customInput: '',
    customInputBuf: '', //input buffer to store customInput when toggled OFF
    output: '',
    autoSave: true,
    autoSaveIntervalId: null
  },
  mutations: {
    toggleCustomInput (state) {
      state.showCustomInput = !state.showCustomInput
      if ( state.showCustomInput ) {
          state.customInput = state.customInputBuf
      } else {
          state.customInputBuf = state.customInput
          state.customInput = ''
      }
    },
    toogleSettings (state) {
      state.showSettings = !state.showSettings
    },
    changeLanguage (state, val) {
      state.language = val
    },
    updateCode (state, val) {
      state.code = val
    },
    uploadCode (state, val) {
      state.code = val
    },
    updateOutput (state, val) {
      state.output = val
    },
    resetCode (state) {
      state.code = samples[state.language]
    },
    changeCustomInput (state, val) {
      state.customInput = val
    },
    changeTheme (state, val) {
      state.theme = val
    },
    changeFont (state, val) {
      state.font = val
    },
    changeFontSize (state, val) {
      state.fontSize = val
    },
    changeAutosave (state, val) {
      if (val) {
        state.autoSaveIntervalId = window.setInterval(()=> {
          window.localStorage.setItem('code', state.code)
        }, 1000)
      } else {
        window.clearInterval(state.autoSaveIntervalId)
        state.autoSaveIntervalId = null
      }
    },
    resetEditor (state) {
      state.commit('changeTheme')
    }
  },
  actions: {
    runJs (context, {code, input}) {
        let jsWorker = null
        if ( process.env.NODE_ENV === 'production' )
            jsWorker = new Worker('../../ide/static/jsWorker.js')
        else
            jsWorker = new Worker('../../static/jsWorker.js')
        input = JSON.stringify(input)
        jsWorker.postMessage({code, input})
        jsWorker.onmessage = function (e) {
            const output = e.data.join('\n')
            context.commit('updateOutput', output)
        }
    },
    runCode ({state, commit, dispatch}) {
      let lang='c'
      switch(state.language){
        case 'C++': lang='cpp'; break
        case 'Javascript': lang='js'; break
        case 'Java': lang='java'; break
        case 'Python': lang='py2'; break
      }

      if ( lang === 'js' ) {
          return dispatch('runJs', {
              code: state.code,
              input: state.customInput
          })
      }

      const config = {
        headers: {
          'Access-Token': '79f3c2f8301fc60565de003f4ac76a1d4e5242cb0836995ec2bd28fd083ce86f'
        }
      }
      return axios.post('https://judge.cb.lk/api/submission',{
              lang,
              source: base64.encode(state.code),
              test_count: 1,
              input: [base64.encode(state.customInput)],
              expected_output: [''],
              get_output: true,
              wait: true
            },config)
            .then( ({data})=>{
              const output = data.result == 'compile_error' ? data.error : data.data.testcases[0].output // I know this seems stupid, but i got no choice :(
              console.log(output);
              commit('updateOutput',base64.decode(output))
            })
      }
  }
})
