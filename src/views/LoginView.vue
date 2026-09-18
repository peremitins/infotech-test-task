<template>
  <section class="auth-page">
    <div class="auth-page__intro">
      <p class="page-eyebrow">Личный доступ</p>
      <h1 class="page-title">Ваше место среди книг</h1>
      <p class="page-description">Войдите, чтобы добавлять и редактировать книги каталога.</p>
    </div>
    <div class="auth-page__form">
      <div class="card card-body auth-card">
        <h2 class="auth-card__title">Вход</h2>
        <p class="text-secondary">Демонстрационные данные: admin / admin123</p>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="submit">
          <label class="form-label" for="username">Логин</label>
          <input
            id="username"
            v-model="username"
            class="form-control mb-3"
            autocomplete="username"
            required
          />
          <label class="form-label" for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            class="form-control mb-4"
            type="password"
            autocomplete="current-password"
            required
          />
          <button class="btn btn-primary w-100" :disabled="pending">
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

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 28rem);
  gap: clamp(2.5rem, 10vw, 8rem);
  align-items: center;
  min-height: calc(100dvh - 13rem);
}

.auth-page__intro {
  max-width: 34rem;
}

.auth-card {
  padding: 2rem;
}

.auth-card__title {
  margin: 0 0 0.45rem;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.035em;
}

@media (max-width: 768px) {
  .auth-page {
    grid-template-columns: 1fr;
    gap: 2rem;
    min-height: auto;
  }

  .auth-card {
    padding: 1.25rem;
  }
}
</style>
