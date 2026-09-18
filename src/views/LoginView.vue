<template>
  <section class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card card-body p-4 p-lg-5">
        <h1 class="page-title h3">Вход</h1>
        <p class="text-secondary">Демонстрационные данные: admin / admin123</p>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="submit">
          <label class="form-label" for="username">Логин</label
          ><input
            id="username"
            v-model="username"
            class="form-control mb-3"
            autocomplete="username"
            required
          /><label class="form-label" for="password">Пароль</label
          ><input
            id="password"
            v-model="password"
            class="form-control mb-4"
            type="password"
            autocomplete="current-password"
            required
          /><button class="btn btn-primary w-100" :disabled="pending">
            {{ pending ? 'Вход...' : 'Войти' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const auth = inject('auth')
const route = useRoute()
const router = useRouter()
const username = ref('admin')
const password = ref('admin123')
const error = ref('')
const pending = ref(false)

async function submit() {
  pending.value = true
  error.value = ''
  try {
    await auth.login({ username: username.value, password: password.value })
    router.push(route.query.next || { name: 'books' })
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    pending.value = false
  }
}
</script>
