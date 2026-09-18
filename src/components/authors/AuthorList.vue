<template>
  <div v-if="!authors.length" class="text-secondary">Авторы не найдены.</div>
  <div v-else class="list-group shadow-sm">
    <RouterLink
      v-for="author in authors"
      :key="author.id"
      class="list-group-item list-group-item-action d-flex justify-content-between"
      :to="{ name: 'author', params: { id: author.id } }"
    >
      <span>{{ author.full_name }}</span>
      <span class="text-secondary">Открыть</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  authors: {
    type: Array,
    default: () => [],
  },
})
</script>
