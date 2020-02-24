import Vue from 'vue';
import axios from 'axios';
window.axios = axios;
import $ from 'jquery';
window.jQuery = window.$ = $;
import 'bootstrap';
import App from './App.vue'
import Swal from 'sweetalert2';
window.Swal = Swal;

new Vue({
  el: '#app',
  render: h => h(App)
})
