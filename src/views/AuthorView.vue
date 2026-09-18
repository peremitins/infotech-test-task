<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="!author" class="text-center py-5 text-secondary">Загрузка автора...</div>
  <section v-else class="author-detail">
    <div class="page-heading">
      <div class="page-heading__copy">
        <p class="page-eyebrow">Автор</p>
        <h1 class="page-title">{{ author.full_name }}</h1>
      </div>
      <div v-if="auth.isAuthenticated.value" class="d-flex gap-2">
        <RouterLink
          class="btn btn-outline-primary"
          :to="{ name: 'author-edit', params: { id: author.id } }"
          >Редактировать</RouterLink
        ><button class="btn btn-outline-danger" type="button" @click="removeAuthor">Удалить</button>
      </div>
    </div>
    <div class="author-detail__layout">
      <div>
        <EntityList :items="author.books" aria-label="Книги автора">
          <template #default="{ item: book }">
            <RouterLink class="entity-list__link" :to="{ name: 'book', params: { id: book.id } }">
              <span class="entity-list__title">{{ book.title }}</span>
              <span class="entity-list__action">{{ book.year }}</span>
            </RouterLink>
          </template>
          <template #empty>У этого автора пока нет книг.</template>
        </EntityList>
      </div>
      <aside>
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
import EntityList from '../components/common/EntityList.vue'
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

<style scoped>
.author-detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.45fr);
  gap: clamp(1rem, 2vw, 2rem);
  align-items: start;
}

.author-detail__section-title {
  margin: 0 0 1rem;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

@media (max-width: 992px) {
  .author-detail__layout {
    grid-template-columns: 1fr;
  }
}
</style>
