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
