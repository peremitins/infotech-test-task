<template>
  <section class="row justify-content-center">
    <div class="col-lg-7">
      <h1 class="page-title h2 mb-4">
        {{ isEdit ? 'Редактирование автора' : 'Новый автор' }}
      </h1>
      <form class="card card-body p-4" @submit.prevent="submit">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <label class="form-label required" for="author-name">ФИО</label
        ><input id="author-name" v-model="fullName" class="form-control" required />
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
