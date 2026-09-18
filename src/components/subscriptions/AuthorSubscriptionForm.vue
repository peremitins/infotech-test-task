<template>
  <form class="subscription-card card card-body" @submit.prevent="submit">
    <p class="subscription-card__eyebrow">Уведомления</p>
    <h2 class="subscription-card__title">Подписка на новые книги</h2>
    <p class="small text-secondary mb-3">
      Оставьте номер, и мы отправим уведомление, когда появится новая книга выбранного автора.
    </p>

    <fieldset class="mb-3">
      <legend class="form-label mb-2">Авторы</legend>
      <div v-for="author in authors" :key="author.id" class="form-check">
        <input
          :id="`subscription-author-${author.id}`"
          v-model="authorIds"
          class="form-check-input"
          type="checkbox"
          :value="author.id"
        />
        <label class="form-check-label" :for="`subscription-author-${author.id}`">
          {{ author.full_name }}
        </label>
      </div>
    </fieldset>

    <label class="form-label" for="subscription-phone">Телефон</label>
    <input
      id="subscription-phone"
      v-model.trim="phone"
      class="form-control"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      placeholder="+79991234567"
    />
    <p v-if="error" class="small text-danger mt-2 mb-0">{{ error }}</p>

    <button class="btn btn-primary mt-3" type="submit">Подписаться</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  authors: { type: Array, default: () => [] },
})
const emit = defineEmits(['subscribe'])
const authorIds = ref([])
const phone = ref('')
const error = ref('')

watch(
  () => props.authors,
  (authors) => {
    authorIds.value = authors.map((author) => author.id)
  },
  { immediate: true },
)

function submit() {
  error.value = ''
  if (!authorIds.value.length) {
    error.value = 'Выберите хотя бы одного автора.'
    return
  }
  if (!/^\+7\d{10}$/.test(phone.value)) {
    error.value = 'Введите номер в формате +79991234567.'
    return
  }

  emit('subscribe', { phone: phone.value, authorIds: authorIds.value.map(Number) })
}
</script>

<style scoped>
.subscription-card {
  max-width: 32rem;
  padding: 1.5rem;
}

.subscription-card__eyebrow {
  margin: 0 0 0.35rem;
  color: var(--accent);
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.subscription-card__title {
  margin: 0 0 0.5rem;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.7rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

@media (max-width: 768px) {
  .subscription-card {
    max-width: none;
    padding: 1.125rem;
  }
}
</style>
