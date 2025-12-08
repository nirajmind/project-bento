import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia
import App from './App.vue'
import './assets/base.css'

const app = createApp(App)
const pinia = createPinia() // Create instance

app.use(pinia) // Use it
app.mount('#app')