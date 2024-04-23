// import './assets/main.css'
import '@unocss/reset/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'

// import '@unocss/reset/tailwind-compat.css'
// import router from './router'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
})
app.use(createPinia())
app.use(router)

app.mount('#app')
