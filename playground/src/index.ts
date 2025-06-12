import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import { Amap } from '../../src';

const app = createApp(App);

app.use(Amap, {
  loadOptions: {
    key: import.meta.env.VITE_YOUR_KEY,
    version: '2.0',
    plugins: ['AMap.Geocoder']
  },
  hideLogo: true
});

app.mount('#app');
