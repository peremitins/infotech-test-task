<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="!author" class="text-center py-5 text-secondary">Загрузка автора...</div>
  <section v-else>
    <div class="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
      <div>
        <p class="text-secondary mb-1">Автор</p>
        <h1 class="page-title mb-0">{{ author.full_name }}</h1>
      </div>
      <div v-if="auth.isAuthenticated.value" class="d-flex gap-2">
        <RouterLink
          class="btn btn-outline-primary"
          :to="{ name: 'author-edit', params: { id: author.id } }"
          >Редактировать</RouterLink
        ><button class="btn btn-outline-danger" type="button" @click="removeAuthor">Удалить</button>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-lg-8">
        <h2 class="h4 mb-3">Книги автора</h2>
        <div v-if="!author.books.length" class="text-secondary">У этого автора пока нет книг.</div>
        <div v-else class="list-group">
          <RouterLink
            v-for="book in author.books"
            :key="book.id"
            class="list-group-item list-group-item-action"
            :to="{ name: 'book', params: { id: book.id } }"
            ><span class="fw-semibold">{{ book.title }}</span
            ><span class="text-secondary ms-2">{{ book.year }}</span></RouterLink
          >
        </div>
      </div>
      <aside class="col-lg-4">
        <AuthorSubscriptionForm :authors="[author]" @subscribe="subscribe" />
        <p v-if="subscriptionMessage" class="small text-success mt-3 mb-0">
          {{ subscriptionMessage }}
        </p>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthorSubscriptionForm from '../components/subscriptions/AuthorSubscriptionForm.vue'
import { createSubscription } from '../mocks/database'

const props = defineProps({ id: { type: String, required: true } })
const api = inject('api')
const auth = inject('auth')
const router = useRouter()
const author = ref(null)
const subscriptionMessage = ref('')
const error = ref('')

async function load() {
  try {
    author.value = await api.getAuthor(props.id)
  } catch (requestError) {
    error.value = requestError.message
  }
}

function subscribe({ phone, authorIds }) {
  authorIds.forEach((authorId) => createSubscription({ authorId, phone }))
  subscriptionMessage.value = 'Подписка сохранена. При выходе новой книги придёт смс-уведомление.'
}

async function removeAuthor() {
  if (!window.confirm('Удалить автора?')) return
  try {
    await api.deleteAuthor(props.id)
    router.push({ name: 'authors' })
  } catch (requestError) {
    error.value = requestError.message
  }
}

onMounted(load)
</script>
