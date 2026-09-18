<template>
  <section>
    <h1 class="page-title h2">Топ-10 авторов</h1>
    <p class="text-secondary">Рейтинг по числу выпущенных книг за выбранный период.</p>
    <div class="report-filter my-4">
      <label class="form-label" for="report-year">Год выпуска</label>
      <select id="report-year" v-model="year" class="form-control">
        <option value="">За всё время</option>
        <option v-for="option in years" :key="option" :value="String(option)">
          {{ option }}
        </option>
      </select>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="report" class="card">
      <div v-if="!report.items.length" class="card-body text-secondary">
        {{ emptyMessage }}
      </div>
      <ol v-else class="list-group list-group-numbered list-group-flush">
        <li v-for="author in report.items" :key="author.author_id" class="list-group-item d-flex">
          <RouterLink
            :to="{ name: 'author', params: { id: author.author_id } }"
            :data-test="`report-author-${author.author_id}`"
            class="link-primary link-offset-2"
          >
            {{ author.full_name }}
          </RouterLink>
          <span class="d-flex align-items-center badge text-bg-primary rounded-pill count-badge">
            {{ author.books_count }}
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useDebounce } from '../composables/useDebounce'

const api = inject('api')
const year = ref('')
const years = ref([])
const report = ref(null)
const error = ref('')
const { schedule } = useDebounce()

const emptyMessage = computed(() =>
  year.value ? `За ${year.value} год книг не найдено.` : 'За всё время книг не найдено.',
)

async function load() {
  error.value = ''
  try {
    report.value = await api.getTopAuthors(year.value || undefined)
  } catch (requestError) {
    error.value = requestError.message
  }
}

async function loadYears() {
  const { items } = await api.getBooks({ 'per-page': 100 })
  years.value = [...new Set(items.map((book) => Number(book.year)))].sort(
    (left, right) => right - left,
  )
}

watch(year, () => schedule(load))

onMounted(async () => {
  try {
    await loadYears()
  } catch (requestError) {
    error.value = requestError.message
  }
  await load()
})
</script>

<style scoped>
.count-badge {
  margin-left: auto;
}
</style>
