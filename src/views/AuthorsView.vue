<template>
  <section class="page-heading">
    <div class="page-heading__copy">
      <p class="page-eyebrow">Люди книги</p>
      <h1 class="page-title">Авторы</h1>
      <p class="page-description">Имена, за которыми стоят книги этого каталога.</p>
    </div>
    <RouterLink
      v-if="auth.isAuthenticated.value"
      class="btn btn-primary"
      :to="{ name: 'author-create' }"
      >Добавить автора</RouterLink
    >
  </section>
  <div class="author-search mb-4">
    <label class="form-label visually-hidden" for="author-search">Поиск автора</label>
    <input id="author-search" v-model="search" class="form-control" placeholder="Найти автора" />
  </div>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <AuthorList v-else :authors="authors" />
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AuthorList from '../components/authors/AuthorList.vue'
import { useDebounce } from '../composables/useDebounce'

const api = inject('api')
const auth = inject('auth')
const authors = ref([])
const search = ref('')
const error = ref('')
const { schedule } = useDebounce()

async function load() {
  try {
    authors.value = (await api.getAuthors({ search: search.value, 'per-page': 100 })).items
  } catch (requestError) {
    error.value = requestError.message
  }
}

watch(search, () => schedule(load))

onMounted(load)
</script>

<style scoped>
.author-search {
  max-width: 42rem;
}
</style>
