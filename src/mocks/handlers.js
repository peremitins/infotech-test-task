import { http, HttpResponse, passthrough } from 'msw'
import {
  createAuthor,
  createBook,
  deleteAuthor,
  deleteBook,
  getAuthor,
  getAuthors,
  getBook,
  getBooks,
  getTopAuthors,
  updateAuthor,
  updateBook,
} from './database'

const baseUrl = '*/api/v1'

function success(data, status = 200) {
  return HttpResponse.json({ success: true, data }, { status })
}

function failure(status, message, field = null) {
  return HttpResponse.json({ success: false, errors: [{ field, message }] }, { status })
}

function protectedRoute(request) {
  return request.headers.get('Authorization') === 'Bearer demo-token'
}

function coverUrl(file) {
  if (!file || typeof file === 'string') return undefined
  return `https://placehold.co/480x640/1f3b5b/ffffff?text=${encodeURIComponent(file.name)}`
}

async function readBookForm(request) {
  const form = await request.formData()
  return {
    title: String(form.get('title') ?? '').trim(),
    year: Number(form.get('year')),
    description: String(form.get('description') ?? '').trim(),
    isbn: String(form.get('isbn') ?? '').trim(),
    authorIds: form.getAll('author_ids[]').map(Number),
    coverUrl: coverUrl(form.get('cover')),
  }
}

function validateBook(book, requireCover) {
  if (!book.title) return failure(422, 'Укажите название книги.', 'title')
  if (!Number.isInteger(book.year) || book.year < 1)
    return failure(422, 'Укажите корректный год.', 'year')
  if (!book.authorIds.length) return failure(422, 'Выберите хотя бы одного автора.', 'author_ids')
  if (requireCover && !book.coverUrl) return failure(422, 'Добавьте обложку книги.', 'cover')
  return null
}

export const handlers = [
  http.all('/sms-api', () => passthrough()),

  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const { username, password } = await request.json()
    if (username !== 'admin' || password !== 'admin123')
      return failure(401, 'Неверные учётные данные.')
    return success({
      token: 'demo-token',
      expires_at: '2030-01-01T00:00:00Z',
      user: { id: 1, username: 'admin', role: 'user' },
    })
  }),

  http.get(`${baseUrl}/books`, ({ request }) => {
    const url = new URL(request.url)
    return success(
      getBooks({
        page: url.searchParams.get('page') ?? 1,
        perPage: url.searchParams.get('per-page') ?? 8,
        authorIds: [
          ...url.searchParams.getAll('author_ids[]'),
          url.searchParams.get('author_id'),
        ].filter(Boolean),
        year: url.searchParams.get('year'),
        search: url.searchParams.get('search'),
      }),
    )
  }),

  http.get(`${baseUrl}/books/:id`, ({ params }) => {
    const book = getBook(params.id)
    return book ? success(book) : failure(404, 'Книга не найдена.')
  }),

  http.post(`${baseUrl}/books`, async ({ request }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const book = await readBookForm(request)
    const error = validateBook(book, true)
    return error ?? success(createBook(book), 201)
  }),

  http.put(`${baseUrl}/books/:id`, async ({ request, params }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const book = await readBookForm(request)
    const error = validateBook(book, true)
    if (error) return error
    const updated = updateBook(params.id, book)
    return updated ? success(updated) : failure(404, 'Книга не найдена.')
  }),

  http.patch(`${baseUrl}/books/:id`, async ({ request, params }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const body = await request.json()
    const book = {
      title: String(body.title ?? '').trim(),
      year: Number(body.year),
      description: String(body.description ?? '').trim(),
      isbn: String(body.isbn ?? '').trim(),
      authorIds: Array.isArray(body.author_ids) ? body.author_ids.map(Number) : [],
    }
    const error = validateBook(book, false)
    if (error) return error
    const updated = updateBook(params.id, book)
    return updated ? success(updated) : failure(404, 'Книга не найдена.')
  }),

  http.delete(`${baseUrl}/books/:id`, ({ request, params }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    return deleteBook(params.id)
      ? new HttpResponse(null, { status: 204 })
      : failure(404, 'Книга не найдена.')
  }),

  http.get(`${baseUrl}/authors`, ({ request }) => {
    const url = new URL(request.url)
    return success(
      getAuthors({
        page: url.searchParams.get('page') ?? 1,
        perPage: url.searchParams.get('per-page') ?? 20,
        search: url.searchParams.get('search'),
      }),
    )
  }),

  http.get(`${baseUrl}/authors/:id`, ({ params }) => {
    const author = getAuthor(params.id)
    return author ? success(author) : failure(404, 'Автор не найден.')
  }),

  http.post(`${baseUrl}/authors`, async ({ request }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const fullName = String((await request.json()).full_name ?? '').trim()
    return fullName
      ? success(createAuthor(fullName), 201)
      : failure(422, 'Укажите ФИО автора.', 'full_name')
  }),

  http.put(`${baseUrl}/authors/:id`, async ({ request, params }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const fullName = String((await request.json()).full_name ?? '').trim()
    if (!fullName) return failure(422, 'Укажите ФИО автора.', 'full_name')
    const author = updateAuthor(params.id, fullName)
    return author ? success(author) : failure(404, 'Автор не найден.')
  }),

  http.delete(`${baseUrl}/authors/:id`, ({ request, params }) => {
    if (!protectedRoute(request)) return failure(401, 'Требуется авторизация.')
    const result = deleteAuthor(params.id)
    if (result === 'has-books') return failure(422, 'Нельзя удалить автора, у которого есть книги.')
    return result ? new HttpResponse(null, { status: 204 }) : failure(404, 'Автор не найден.')
  }),

  http.get(`${baseUrl}/reports/top-authors`, ({ request }) => {
    const year = new URL(request.url).searchParams.get('year')
    if (year && !Number.isInteger(Number(year)))
      return failure(400, 'Укажите корректный год.', 'year')
    return success({ year: year ? Number(year) : null, items: getTopAuthors(year) })
  }),
]
