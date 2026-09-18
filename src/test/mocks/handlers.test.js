import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../../mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  localStorage.clear()
  server.resetHandlers()
})
afterAll(() => server.close())

describe('обработчики демонстрационного API', () => {
  it('возвращает четыре книги на второй странице каталога', async () => {
    localStorage.clear()

    const response = await fetch('http://localhost/api/v1/books?page=2&per-page=4')
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.data.items).toHaveLength(4)
    expect(payload.data.pagination).toMatchObject({ page: 2, per_page: 4 })
  })

  it('возвращает токен для демонстрационной учётной записи', async () => {
    const response = await fetch('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    })

    expect(response.status).toBe(200)
    expect((await response.json()).data.token).toBe('demo-token')
  })

  it('отклоняет создание книги без токена авторизации', async () => {
    const form = new FormData()
    form.append('title', 'Новая книга')
    form.append('year', '2024')
    form.append('author_ids[]', '1')
    form.append('cover', new File(['cover'], 'cover.png', { type: 'image/png' }))

    const response = await fetch('http://localhost/api/v1/books', { method: 'POST', body: form })

    expect(response.status).toBe(401)
    expect((await response.json()).success).toBe(false)
  })
})
