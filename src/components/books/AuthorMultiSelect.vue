<template>
  <div class="author-filter">
    <label class="form-label" for="book-authors">Авторы</label>
    <button
      id="book-authors"
      class="form-select text-start"
      type="button"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      {{ buttonText }}
    </button>
    <div v-if="isOpen" class="author-filter__menu shadow-sm">
      <div class="input-group input-group-sm mb-2">
        <input v-model="search" class="form-control" placeholder="Найти автора" />
        <button class="btn btn-outline-secondary" type="button" @click="clear">Сбросить</button>
      </div>
      <div v-if="!filteredAuthors.length" class="small text-secondary py-2">Авторы не найдены.</div>
      <label v-for="author in filteredAuthors" :key="author.id" class="form-check py-1">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="modelValue.includes(author.id)"
          @change="toggle(author.id)"
        />
        <span class="form-check-label">{{ author.full_name }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  authors: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const search = ref('')

const filteredAuthors = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return props.authors
  return props.authors.filter((author) => author.full_name.toLowerCase().includes(query))
})

const buttonText = computed(() => {
  if (!props.modelValue.length) return 'Все авторы'
  return props.authors
    .filter((author) => props.modelValue.includes(author.id))
    .map((author) => author.full_name)
    .join(', ')
})

function toggle(authorId) {
  const next = props.modelValue.includes(authorId)
    ? props.modelValue.filter((id) => id !== authorId)
    : [...props.modelValue, authorId]
  emit('update:modelValue', next)
}

function clear() {
  search.value = ''
  emit('update:modelValue', [])
}
</script>
