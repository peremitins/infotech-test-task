<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="!book" class="text-center py-5 text-secondary">Загрузка книги...</div>
  <article v-else class="book-detail">
    <div class="book-detail__cover-column">
      <img class="book-detail__cover" :src="book.cover_url" :alt="`Обложка: ${book.title}`" />
    </div>
    <div class="book-detail__content">
      <div v-if="route.query.notification" class="alert alert-info">
        {{ route.query.notification }}
      </div>
      <div class="book-detail__topline">
        <div>
          <p class="page-eyebrow">Издание {{ book.year }}</p>
          <h1 class="page-title">{{ book.title }}</h1>
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
      <p class="book-detail__description">{{ book.description || 'Описание не добавлено.' }}</p>
      <dl class="book-detail__meta">
        <div>
          <dt>ISBN</dt>
          <dd>{{ book.isbn || 'Не указан' }}</dd>
        </div>
        <div>
          <dt>Авторы</dt>
          <dd>
            <RouterLink
              v-for="author in book.authors"
              :key="author.id"
              class="d-block mb-1"
              :to="{ name: 'author', params: { id: author.id } }"
              >{{ author.full_name }}</RouterLink
            >
          </dd>
        </div>
      </dl>
      <aside class="book-detail__subscription">
        <AuthorSubscriptionForm :authors="book.authors" @subscribe="subscribe" />
        <p v-if="subscriptionMessage" class="small text-success mt-3 mb-0">
          {{ subscriptionMessage }}
        </p>
      </aside>
      <RouterLink class="book-detail__back" :to="{ name: 'books' }">К каталогу</RouterLink>
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

<style scoped>
.book-detail {
  display: grid;
  grid-template-columns: minmax(16rem, 0.78fr) minmax(0, 1.5fr);
  gap: clamp(1rem, 2vw, 2rem);
  align-items: start;
}

.book-detail__cover-column {
  position: sticky;
  top: 6.5rem;
}

.book-detail__cover {
  width: 100%;
  max-height: 34rem;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
}

.book-detail__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: space-between;
  gap: 1.25rem;
}

.book-detail__description {
  max-width: 45rem;
  margin: 1rem 0 0;
  color: #455148;
  font-size: 1.05rem;
  line-height: 1.75;
}

.book-detail__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
  margin: 1rem 0 0;
  padding: 1.25rem 0;
  border-block: 1px solid var(--line);
}

.book-detail__meta dt {
  margin-bottom: 0.25rem;
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.book-detail__meta dd {
  margin: 0;
  color: var(--ink);
  font-weight: 700;
}

.book-detail__meta a {
  display: inline-block;
  margin-right: 0.75rem;
  color: var(--brand);
}

.book-detail__subscription {
  margin-top: 2rem;
}

.book-detail__back {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--brand);
  font-weight: 800;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.25rem;
}

@media (max-width: 768px) {
  .book-detail {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .book-detail__cover-column {
    position: static;
    max-width: 24rem;
  }

  .book-detail__meta {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
