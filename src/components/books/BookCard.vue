<template>
  <RouterLink
    class="card card-hover h-100 text-decoration-none text-dark overflow-hidden"
    :to="{ name: 'book', params: { id: book.id } }"
  >
    <img class="book-cover" :src="book.cover_url" :alt="`Обложка: ${book.title}`" />
    <div class="d-flex flex-column card-body">
      <h2 class="h5">{{ book.title }}</h2>
      <p class="small text-secondary mb-2">{{ book.year }}</p>
      <p class="small text-secondary mt-auto mb-0">
        {{ book.authors.map((author) => author.full_name).join(', ') }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  book: {
    type: Object,
    required: true,
  },
})
</script>
