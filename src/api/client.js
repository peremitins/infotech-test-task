export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

const API_BASE = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/v1`

function toQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(`${key}[]`, item))
      return
    }
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const result = query.toString()
  return result ? `?${result}` : ''
}

function toBookForm(book) {
  const form = new FormData()
  form.append('title', book.title)
  form.append('year', String(book.year))
  form.append('description', book.description ?? '')
  form.append('isbn', book.isbn ?? '')
  book.authorIds.forEach((id) => form.append('author_ids[]', String(id)))
  if (book.cover) form.append('cover', book.cover)
  return form
}

export function createApiClient(getToken) {
  async function request(path, options = {}) {
    const headers = new Headers(options.headers)
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    if (options.body && !(options.body instanceof FormData))
      headers.set('Content-Type', 'application/json')

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
    if (response.status === 204) return null

    const payload = await response.json()
    if (!response.ok || !payload.success) {
      throw new ApiError(
        payload.errors?.[0]?.message ?? 'Не удалось выполнить запрос.',
        response.status,
        payload.errors,
      )
    }
    return payload.data
  }

  return {
    login(credentials) {
      return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    },
    getBooks(filters) {
      return request(`/books${toQuery(filters)}`)
    },
    getBook(id) {
      return request(`/books/${id}`)
    },
    createBook(book) {
      return request('/books', { method: 'POST', body: toBookForm(book) })
    },
    updateBook(id, book) {
      if (book.cover) return request(`/books/${id}`, { method: 'PUT', body: toBookForm(book) })
      return request(`/books/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: book.title,
          year: Number(book.year),
          description: book.description ?? '',
          isbn: book.isbn ?? '',
          author_ids: book.authorIds.map(Number),
        }),
      })
    },
    deleteBook(id) {
      return request(`/books/${id}`, { method: 'DELETE' })
    },
    getAuthors(filters) {
      return request(`/authors${toQuery(filters)}`)
    },
    getAuthor(id) {
      return request(`/authors/${id}`)
    },
    createAuthor(fullName) {
      return request('/authors', { method: 'POST', body: JSON.stringify({ full_name: fullName }) })
    },
    updateAuthor(id, fullName) {
      return request(`/authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ full_name: fullName }),
      })
    },
    deleteAuthor(id) {
      return request(`/authors/${id}`, { method: 'DELETE' })
    },
    getTopAuthors(year) {
      return request(`/reports/top-authors${toQuery({ year })}`)
    },
  }
}
