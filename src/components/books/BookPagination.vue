<template>
  <nav v-if="pagination && pagination.total_pages > 1" class="mt-4" aria-label="Страницы каталога">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: pagination.page === 1 }">
        <button
          class="page-link"
          type="button"
          :disabled="pagination.page === 1"
          @click="$emit('change', pagination.page - 1)"
        >
          Назад
        </button>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: pagination.page === page }"
      >
        <button class="page-link" type="button" @click="$emit('change', page)">
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: pagination.page === pagination.total_pages }">
        <button
          class="page-link"
          type="button"
          :disabled="pagination.page === pagination.total_pages"
          @click="$emit('change', pagination.page + 1)"
        >
          Вперёд
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pagination: {
    type: Object,
    default: null,
  },
})

defineEmits(['change'])

const pages = computed(() =>
  Array.from({ length: props.pagination?.total_pages ?? 0 }, (_, index) => index + 1),
)
</script>

<style scoped>
.pagination {
  flex-wrap: wrap;
  gap: 0.35rem;
}

.pagination .page-item {
  margin: 0;
}

.pagination .page-link {
  min-width: 2.5rem;
  border-color: var(--line);
  border-radius: 0.55rem !important;
  color: var(--brand);
  font-weight: 700;
}

.pagination .page-link:hover {
  border-color: #afc3b7;
  background: #edf3ee;
  color: var(--brand-strong);
}

.pagination .active > .page-link {
  border-color: var(--brand);
  background: var(--brand);
  color: var(--paper);
}

.pagination .disabled > .page-link {
  border-color: var(--line);
  background: var(--surface-muted);
  color: #90978f;
}

@media (max-width: 768px) {
  .pagination .page-link {
    min-width: 2.25rem;
    padding-inline: 0.55rem;
  }
}
</style>
