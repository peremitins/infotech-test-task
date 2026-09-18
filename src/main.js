import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/main.css'
import App from './App.vue'
import { createApiClient } from './api/client'
import { createAuth } from './composables/auth'
import { getServiceWorkerUrl } from './mocks/serviceWorker'
import router from './router'

async function startMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'false') return
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: getServiceWorkerUrl(import.meta.env.BASE_URL) },
  })
}

await startMocking()

let auth
const api = createApiClient(() => auth.token.value)
auth = createAuth(api)
const app = createApp(App)
app.provide('api', api)
app.provide('auth', auth)
app.use(router)
app.mount('#app')
