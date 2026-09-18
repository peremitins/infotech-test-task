import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = encodeURIComponent(env.SMS_PILOT_API_KEY ?? '')

  return {
    plugins: [vue()],
    base: mode === 'production' ? '/infotech-test-task/' : '/',
    server: {
      proxy: {
        '/sms-api': {
          target: 'https://smspilot.ru',
          changeOrigin: true,
          bypass(request) {
            const url = new URL(request.url, 'http://localhost')
            url.pathname = '/api.php'
            url.searchParams.set('apikey', apiKey)
            request.url = `${url.pathname}${url.search}`
          },
        },
      },
    },
  }
})
