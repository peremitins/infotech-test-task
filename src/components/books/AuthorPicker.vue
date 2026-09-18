<template>
  <div>
    <label class="form-label required" for="author-search">Авторы</label>
    <input
      id="author-search"
      v-model="search"
      class="form-control mb-3"
      placeholder="Найти автора в списке"
    />
    <div v-if="!filteredAuthors.length" class="text-secondary small">
      Подходящие авторы не найдены.
    </div>
    <div v-else class="row g-2">
      <div v-for="author in filteredAuthors" :key="author.id" class="col-md-6">
        <label class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="modelValue.includes(author.id)"
            @change="toggleAuthor(author.id)"
          />
          <span class="form-check-label">{{ author.full_name }}</span>
        </label>
      </div>
    </div>
    <div v-if="modelValue.length" class="form-text">Выбрано авторов: {{ modelValue.length }}</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  authors: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])
const search = ref('')

const filteredAuthors = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return props.authors
  return props.authors.filter((author) => author.full_name.toLowerCase().includes(query))
})

function toggleAuthor(authorId) {
  const next = props.modelValue.includes(authorId)
    ? props.modelValue.filter((id) => id !== authorId)
    : [...props.modelValue, authorId]
  emit('update:modelValue', next)
}
</script>
