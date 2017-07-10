<template>
  <div id="app">
    <navbar></navbar>
    <editor></editor>
    <footer-comp></footer-comp>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import FooterComp from './components/Footer-comp'
import Editor from './components/Editor'

export default {
  name: 'app',
  components: {
    Navbar,
    FooterComp,
    Editor
  }
}
</script>
<style src="bootstrap/dist/css/bootstrap.css"></style>
<style src="font-awesome/css/font-awesome.css"></style>
<style src="./assets/css/whole.css"></style>

