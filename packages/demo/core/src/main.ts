import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { main } from "./service/sandbox";

main();

createApp(App).mount('#app')
