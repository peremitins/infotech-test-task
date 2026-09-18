<template>
  <RouterLink
    class="book-card card h-100 text-decoration-none overflow-hidden"
    :to="{ name: 'book', params: { id: book.id } }"
  >
    <img class="book-cover" :src="book.cover_url" :alt="`Обложка: ${book.title}`" />
    <div class="d-flex flex-column card-body book-card__body">
      <h2 class="h5 book-card__title">{{ book.title }}</h2>
      <p class="small text-secondary mb-2 book-card__year">{{ book.year }}</p>
      <p class="small text-secondary mt-auto mb-0 book-card__authors">
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

<style scoped>
.book-cover {
  width: 100%;
  height: 275px;
  object-fit: cover;
  background: #e2e8f0;
  transition: transform 0.35s ease;
}

.book-card__body {
  min-height: 10.75rem;
  padding: 1.25rem;
}

.book-card__title {
  display: -webkit-box;
  min-height: 3.2rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.12;
}

.book-card__year {
  color: var(--accent) !important;
  font-size: 0.75rem !important;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

.book-card__authors {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--ink-muted) !important;
  font-size: 0.8125rem !important;
  line-height: 1.5;
}

.book-card {
  border-color: var(--line);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;
}

.book-card:hover {
  border-color: #b6c8bb;
  box-shadow: var(--shadow-md);
  transform: translateY(-0.25rem);
}

.book-card:hover .book-cover {
  transform: scale(1.025);
}

.book-card:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

@media (max-width: 992px) {
  .book-cover {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .book-cover {
    height: 210px;
  }
}

@media (max-width: 400px) {
  .book-cover {
    height: 190px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .book-cover,
  .book-card {
    transition: none;
  }
}
</style>
