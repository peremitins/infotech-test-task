import { beforeEach, describe, expect, it } from 'vitest'
import { createAuth } from '../../composables/auth'

describe('состояние авторизации', () => {
  beforeEach(() => localStorage.clear())

  it('сохраняет токен после входа и удаляет его после выхода', async () => {
    const api = {
      login: async () => ({ token: 'demo-token', user: { username: 'admin', role: 'user' } }),
    }
    const auth = createAuth(api)

    await auth.login({ username: 'admin', password: 'admin123' })

    expect(auth.isAuthenticated.value).toBe(true)
    expect(localStorage.getItem('infotech-book-token')).toBe('demo-token')

    auth.logout()

    expect(auth.isAuthenticated.value).toBe(false)
    expect(localStorage.getItem('infotech-book-token')).toBeNull()
  })
})
