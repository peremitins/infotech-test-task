<template>
  <section class="row justify-content-center">
    <div class="col-xl-8">
      <h1 class="page-title h2 mb-4">
        {{ isEdit ? 'Редактирование книги' : 'Новая книга' }}
      </h1>
      <form class="card card-body p-4" @submit.prevent="submit">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label required" for="title">Название</label
            ><input id="title" v-model="form.title" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label class="form-label required" for="year">Год</label
            ><input
              id="year"
              v-model="form.year"
              class="form-control"
              type="number"
              min="1"
              required
            />
          </div>
          <div class="col-12">
            <label class="form-label" for="description">Описание</label
            ><textarea id="description" v-model="form.description" class="form-control" rows="4" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="isbn">ISBN</label
            ><input id="isbn" v-model="form.isbn" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="cover">{{ isEdit ? 'Новая обложка' : 'Обложка' }}</label
            ><input
              id="cover"
              class="form-control"
              type="file"
              accept="image/*"
              :required="!isEdit"
              @change="selectCover"
            />
          </div>
          <div class="col-12">
            <AuthorPicker v-model="form.authorIds" :authors="authors" />
          </div>
          <div class="col-12">
            <fieldset class="new-authors">
              <legend class="form-label mb-2">Новые авторы</legend>
              <p class="form-text mt-0 mb-2">
                Добавьте автора, если его ещё нет в списке. Он будет создан вместе с книгой.
              </p>
              <div
                v-for="(_, index) in newAuthorNames"
                :key="index"
                class="new-authors__field input-group mb-2"
              >
                <input
                  :id="`new-author-${index}`"
                  v-model="newAuthorNames[index]"
                  class="form-control"
                  placeholder="ФИО автора"
                />
                <button
                  v-if="newAuthorNames.length > 1"
                  class="btn btn-outline-secondary"
                  type="button"
                  :aria-label="`Удалить автора ${index + 1}`"
                  @click="removeNewAuthor(index)"
                >
                  Удалить
                </button>
              </div>
              <button
                class="btn btn-link btn-sm px-0"
                type="button"
                data-test="add-new-author"
                :disabled="!canAddNewAuthor"
                @click="addNewAuthor"
              >
                Добавить автора
              </button>
            </fieldset>
          </div>
        </div>
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
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthorPicker from '../components/books/AuthorPicker.vue'
import { getSubscribersForAuthors } from '../mocks/database'
import { sendNewBookNotifications } from '../services/sms'

const props = defineProps({ id: { type: String, default: '' } })
const api = inject('api')
const router = useRouter()
const isEdit = Boolean(props.id)
const form = reactive({
  title: '',
  year: '',
  description: '',
  isbn: '',
  authorIds: [],
  cover: null,
})
const authors = ref([])
const newAuthorNames = ref([''])
const error = ref('')
const notification = ref('')
const pending = ref(false)
const canAddNewAuthor = computed(() => Boolean(newAuthorNames.value.at(-1)?.trim()))

function selectCover(event) {
  form.cover = event.target.files[0] ?? null
}

function addNewAuthor() {
  if (canAddNewAuthor.value) newAuthorNames.value.push('')
}

function removeNewAuthor(index) {
  newAuthorNames.value.splice(index, 1)
}

function getNewAuthorNames() {
  return newAuthorNames.value.map((name) => name.trim()).filter(Boolean)
}

async function load() {
  try {
    authors.value = (await api.getAuthors({ 'per-page': 100 })).items
    if (!isEdit) return
    const book = await api.getBook(props.id)
    form.title = book.title
    form.year = book.year
    form.description = book.description
    form.isbn = book.isbn
    form.authorIds = book.authors.map((author) => author.id)
  } catch (requestError) {
    error.value = requestError.message
  }
}

function validate() {
  if (!form.title.trim()) return 'Укажите название книги.'
  if (!Number.isInteger(Number(form.year)) || Number(form.year) < 1)
    return 'Укажите корректный год.'
  if (!form.authorIds.length && !getNewAuthorNames().length)
    return 'Выберите или добавьте хотя бы одного автора.'
  if (!isEdit && !form.cover) return 'Добавьте обложку книги.'
  return ''
}

async function submit() {
  error.value = ''
  notification.value = ''
  error.value = validate()
  if (error.value) return
  pending.value = true
  try {
    const newAuthors = await Promise.all(
      getNewAuthorNames().map((fullName) => api.createAuthor(fullName)),
    )
    const authorIds = [...new Set([...form.authorIds, ...newAuthors.map((author) => author.id)])]
    const bookData = { ...form, authorIds }
    const book = isEdit ? await api.updateBook(props.id, bookData) : await api.createBook(bookData)
    if (!isEdit) {
      const result = await sendNewBookNotifications(book, getSubscribersForAuthors(authorIds))
      if (result.sent) {
        const ids = result.messages.map((message) => message.serverId).join(', ')
        notification.value = `SMS Pilot принял тестовых уведомлений: ${result.sent}. Идентификаторы: ${ids}.`
      }
      if (result.failed)
        notification.value = `${notification.value} Не удалось отправить: ${result.failed}.`
    }
    router.push({
      name: 'book',
      params: { id: book.id },
      query: notification.value ? { notification: notification.value } : undefined,
    })
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    pending.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.new-authors {
  margin: 0;
  padding: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
}

.new-authors__field {
  max-width: 36rem;
}
</style>
