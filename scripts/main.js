/**
 * Created by umair on 26/12/16.



 */

var lang;
var lang_sample;

var mode = {
  js : "javascript",
  py2 : "python",
  c : "c_cpp",
  cpp : "c_cpp",
  java : "java"
}

function setLang(ext) {
  var element = $(`#${ext}`);
  $('ul li.active').removeClass('active');
  element.closest('li').addClass('active');
  ace.edit("editor").getSession().setMode(`ace/mode/${mode[ext]}`);
  $('#curLang').html(element.html());
  lang = ext;
}

function init() {
    if (lang == undefined || lang == 'c') {
        lang = 'c';
    }
    lang_sample = lang_samples[lang];
    ace.edit("editor").setValue(lang_sample);
    console.log("Language = " + lang);
}

    $('.changetheme').click(function (event) {
        event.preventDefault();
        var newtheme = $(this).attr('id');
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/"+newtheme); 
    });

$(document).ready(function () {
    var URL = "https://judge.cb.lk/api/";

    init();

    var runButton = $('#submit');
    runButton.click(function () {
        runButton.button('loading');
        var source = ace.edit("editor").getValue();	
        if(lang === 'js') {
            var jsWorker = new Worker('scripts/javascriptWebWorker.js');
            var input = '';
            jsWorker.postMessage( {source , input } );

            jsWorker.onmessage = function (e) {
                console.log(e.data);
                runButton.button('reset');
                $('#output').text(e.data.output.join('\n'));
            };

            return ;
        }

        source = window.btoa(source);
        var testcases = $("#test-input").val(); // cusotm inputs
        testcases = window.btoa(testcases);
        var expected = '';
        
        var config = {
            headers: {'Access-Token': '79f3c2f8301fc60565de003f4ac76a1d4e5242cb0836995ec2bd28fd083ce86f'}
        };
        axios.post(URL + 'submission', {
            lang: lang,
            source: source,
            test_count: 1, //Always 1 for the IDE
            input: [testcases], //only one testcase required in IDE
            expected_output: [expected], //only one expected output required in IDE
            get_output: true, //Always true for the IDE
            wait: true //Always true for the one hosted at GitHub Pages
        }, config).then(function (response) {
            runButton.button('reset');
            var data = response.data;
            if (data.result == "compile_error") {
                var output = data.error;
                output = window.atob(output);
                $('#output').text(output);
            } else {
                var output = data.data.testcases[0].output;
                output = window.atob(output);
                $('#output').text(output);
            }
        }).catch(function (error) {
            console.log(error);
        });
    });

    $('#clear').click(function () {
        ace.edit("editor").setValue('');
        document.getElementById('test-input').value = "";
    });

    $('.lang').click(function (event) {
        event.preventDefault();
        lang = $(this).attr('id');
        setLang(lang);
        init();
    });
  
  $('#uploadFile').click(function(e){
    e.preventDefault();
    $('#upload').click();
  });
  
  var fileInput = document.getElementById('upload');
  fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];
      var ext = file.name.split('.').pop();
      setLang(ext);
      var reader = new FileReader();
      reader.onload = function(e) { // closure to set read data to editor
          ace.edit("editor").setValue(reader.result);
      }
      reader.readAsText(file);	
  });
  
});
