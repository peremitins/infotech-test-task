<template>
  <section>
    <div class="page-heading report-heading">
      <div class="page-heading__copy">
        <p class="page-eyebrow">Рейтинг</p>
        <h1 class="page-title">Топ-10 авторов</h1>
        <p class="page-description">Рейтинг по числу выпущенных книг за выбранный период.</p>
      </div>
    </div>
    <div class="report-filter card card-body mb-4">
      <label class="form-label" for="report-year">Год выпуска</label>
      <select id="report-year" v-model="year" class="form-control">
        <option value="">За всё время</option>
        <option v-for="option in years" :key="option" :value="String(option)">
          {{ option }}
        </option>
      </select>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="report">
      <EntityList :items="report.items" :ordered="true" aria-label="Рейтинг авторов">
        <template #default="{ item: author }">
          <RouterLink
            class="entity-list__link"
            :to="{ name: 'author', params: { id: author.author_id } }"
            :data-test="`report-author-${author.author_id}`"
          >
            <span class="entity-list__title">{{ author.full_name }}</span>
            <span class="badge text-bg-primary rounded-pill count-badge">
              {{ author.books_count }}
            </span>
          </RouterLink>
        </template>
        <template #empty>{{ emptyMessage }}</template>
      </EntityList>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import EntityList from '../components/common/EntityList.vue'
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
.report-heading {
  margin-bottom: 1.5rem;
}

.report-filter {
  max-width: 20rem;
  padding: 1.25rem;
}

@media (max-width: 768px) {
  .report-filter {
    max-width: none;
  }
}

:deep(.count-badge) {
  min-width: 2.1rem;
  padding: 0.45rem 0.6rem;
  background: var(--brand) !important;
  font-variant-numeric: tabular-nums;
}
</style>
