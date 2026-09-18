<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="!book" class="text-center py-5 text-secondary">Загрузка книги...</div>
  <article v-else class="row g-4">
    <div class="col-md-4">
      <img
        class="book-cover-detail shadow-sm"
        :src="book.cover_url"
        :alt="`Обложка: ${book.title}`"
      />
    </div>
    <div class="col-md-8">
      <div v-if="route.query.notification" class="alert alert-info">
        {{ route.query.notification }}
      </div>
      <div class="d-flex flex-wrap justify-content-between gap-3">
        <div>
          <p class="text-primary fw-semibold mb-2">{{ book.year }}</p>
          <h1 class="page-title mb-3">{{ book.title }}</h1>
        </div>
        <div v-if="auth.isAuthenticated.value" class="d-flex gap-2 align-items-start">
          <RouterLink
            class="btn btn-outline-primary btn-sm"
            :to="{ name: 'book-edit', params: { id: book.id } }"
            >Редактировать</RouterLink
          ><button class="btn btn-outline-danger btn-sm" type="button" @click="removeBook">
            Удалить
          </button>
        </div>
      </div>
      <p class="lead">{{ book.description || 'Описание не добавлено.' }}</p>
      <dl class="row mt-4">
        <dt class="col-sm-3">ISBN</dt>
        <dd class="col-sm-9">{{ book.isbn || 'Не указан' }}</dd>
        <dt class="col-sm-3">Авторы</dt>
        <dd class="col-sm-9">
          <RouterLink
            v-for="author in book.authors"
            :key="author.id"
            class="d-block mb-1"
            :to="{ name: 'author', params: { id: author.id } }"
            >{{ author.full_name }}</RouterLink
          >
        </dd>
      </dl>
      <aside class="mt-4">
        <AuthorSubscriptionForm :authors="book.authors" @subscribe="subscribe" />
        <p v-if="subscriptionMessage" class="small text-success mt-3 mb-0">
          {{ subscriptionMessage }}
        </p>
      </aside>
      <RouterLink class="btn btn-link px-0" :to="{ name: 'books' }">К каталогу</RouterLink>
    </div>
  </article>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthorSubscriptionForm from '../components/subscriptions/AuthorSubscriptionForm.vue'
import { createSubscription } from '../mocks/database'

const props = defineProps({ id: { type: String, required: true } })
const api = inject('api')
const auth = inject('auth')
const router = useRouter()
const route = useRoute()
const book = ref(null)
const error = ref('')
const subscriptionMessage = ref('')

async function load() {
  try {
    book.value = await api.getBook(props.id)
  } catch (requestError) {
    error.value = requestError.message
  }
}

async function removeBook() {
  if (!window.confirm('Удалить эту книгу?')) return
  await api.deleteBook(props.id)
  router.push({ name: 'books' })
}

function subscribe({ phone, authorIds }) {
  authorIds.forEach((authorId) => createSubscription({ authorId, phone }))
  subscriptionMessage.value = 'Подписка сохранена. При выходе новой книги придёт смс-уведомление.'
}

onMounted(load)
</script>
