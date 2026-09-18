<template>
  <section class="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
    <div>
      <h1 class="page-title h2 mb-1">Каталог книг</h1>
      <p class="text-secondary mb-0">Книги и авторы из демонстрационного API.</p>
    </div>
    <RouterLink
      v-if="auth.isAuthenticated.value"
      class="btn btn-primary"
      :to="{ name: 'book-create' }"
      >Добавить книгу</RouterLink
    >
  </section>

  <div class="card card-body mb-4">
    <div class="row g-3">
      <div class="col-md-5">
        <label class="form-label" for="book-search">Поиск</label
        ><input
          id="book-search"
          v-model="filters.search"
          class="form-control"
          placeholder="Название, описание или автор"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="book-year">Год</label
        ><input
          id="book-year"
          v-model="filters.year"
          class="form-control"
          type="number"
          min="1"
          placeholder="Например, 2024"
        />
      </div>
      <div class="col-md-4">
        <AuthorMultiSelect v-model="filters.author_ids" :authors="authors" />
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center gap-2 mt-3">
      <button
        class="btn btn-outline-secondary"
        :class="{ 'btn-filter-active': hasActiveFilters }"
        type="button"
        data-test="reset-filters"
        @click="resetFilters"
      >
        Сбросить
      </button>
    </div>
  </div>

  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="loading" class="text-center py-5 text-secondary">Загрузка книг...</div>
  <div v-else-if="!books.length" class="card card-body text-center py-5 text-secondary">
    По вашему запросу ничего не найдено.
  </div>
  <Transition v-else name="catalog-page" mode="out-in" appear>
    <TransitionGroup :key="catalogKey" name="catalog-card" tag="div" class="row g-4" appear>
      <div
        v-for="(book, index) in books"
        :key="book.id"
        class="col-sm-6 col-lg-3"
        :style="{ '--card-index': index }"
      >
        <BookCard :book="book" />
      </div>
    </TransitionGroup>
  </Transition>
  <p v-if="isRefreshing" class="catalog-status" aria-live="polite">Обновляем каталог...</p>
  <BookPagination :pagination="pagination" @change="loadBooks" />
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AuthorMultiSelect from '../components/books/AuthorMultiSelect.vue'
import BookCard from '../components/books/BookCard.vue'
import BookPagination from '../components/books/BookPagination.vue'
import { useDebounce } from '../composables/useDebounce'

const api = inject('api')
const auth = inject('auth')
const books = ref([])
const authors = ref([])
const pagination = ref(null)
const loading = ref(true)
const isRefreshing = ref(false)
const error = ref('')
const catalogKey = ref(0)
const filters = reactive({
  search: '',
  year: '',
  author_ids: [],
})
const currentPage = ref(1)
const perPage = 4
let requestId = 0
let skipNextFilterRequest = false
const { cancel, schedule } = useDebounce()
const hasActiveFilters = computed(() =>
  Boolean(filters.search.trim() || filters.year || filters.author_ids.length),
)

async function loadBooks(page = currentPage.value) {
  const currentRequestId = ++requestId
  const isInitialLoad = !books.value.length
  if (isInitialLoad) loading.value = true
  else isRefreshing.value = true
  error.value = ''
  currentPage.value = page
  try {
    const result = await api.getBooks({ ...filters, page, 'per-page': perPage })
    if (currentRequestId !== requestId) return
    books.value = result.items
    pagination.value = result.pagination
    catalogKey.value += 1
  } catch (requestError) {
    if (currentRequestId !== requestId) return
    error.value = requestError.message
  } finally {
    if (currentRequestId === requestId) {
      loading.value = false
      isRefreshing.value = false
    }
  }
}

async function loadAuthors() {
  const result = await api.getAuthors({ 'per-page': 100 })
  authors.value = result.items
}

function resetFilters() {
  cancel()
  skipNextFilterRequest = true
  filters.search = ''
  filters.year = ''
  filters.author_ids = []
  loadBooks(1)
}

watch(
  () => [filters.search, filters.year, ...filters.author_ids],
  () => {
    if (skipNextFilterRequest) {
      skipNextFilterRequest = false
      return
    }
    schedule(() => loadBooks(1))
  },
)

onMounted(async () => {
  await Promise.all([loadAuthors(), loadBooks()])
})
</script>
