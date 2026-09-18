<template>
  <section class="row justify-content-center form-page">
    <div class="col-lg-7">
      <div class="form-page__heading">
        <p class="page-eyebrow">Авторы</p>
        <h1 class="page-title">{{ isEdit ? 'Редактирование автора' : 'Новый автор' }}</h1>
      </div>
      <form class="card card-body form-page__card" @submit.prevent="submit">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <label class="form-label required" for="author-name">ФИО</label>
        <input id="author-name" v-model="fullName" class="form-control" required />
        <div class="d-flex gap-2 mt-4">
          <button class="btn btn-primary" :disabled="pending">
            {{ pending ? 'Сохранение...' : 'Сохранить' }}</button
          ><button class="btn btn-outline-secondary" type="button" @click="router.back()">
            Отмена
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ id: { type: String, default: '' } })
const api = inject('api')
const router = useRouter()
const fullName = ref('')
const error = ref('')
const pending = ref(false)
const isEdit = Boolean(props.id)

onMounted(async () => {
  if (!isEdit) return
  try {
    fullName.value = (await api.getAuthor(props.id)).full_name
  } catch (requestError) {
    error.value = requestError.message
  }
})

async function submit() {
  error.value = ''
  if (!fullName.value.trim()) {
    error.value = 'Укажите ФИО автора.'
    return
  }
  pending.value = true
  try {
    const author = isEdit
      ? await api.updateAuthor(props.id, fullName.value.trim())
      : await api.createAuthor(fullName.value.trim())
    router.push({ name: 'author', params: { id: author.id } })
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.form-page__heading {
  margin-bottom: 1.75rem;
}

.form-page__card {
  padding: 1.75rem;
}

@media (max-width: 768px) {
  .form-page__card {
    padding: 1.125rem;
  }
}
</style>
