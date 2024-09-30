import { createApp } from 'vue';
import App from './App.vue';

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';
import DataTable from './components/DataTable.vue';

const vuetify = createVuetify({
  components,
  directives
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.component('DataTable', DataTable);
app.mount('#app');
