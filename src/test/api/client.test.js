import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApiClient } from '../../api/client'

describe('клиент API', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('добавляет токен авторизации и параметры запроса к запросам каталога', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { items: [], pagination: {} } }), {
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const api = createApiClient(() => 'demo-token')

    await api.getBooks({ search: 'vue', year: 2024 })

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/books?search=vue&year=2024', expect.any(Object))
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe('Bearer demo-token')
  })

  it('отправляет книгу с загруженной обложкой в формате FormData', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: { id: 7 } }), { status: 201 }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const api = createApiClient(() => null)
    const cover = new File(['cover'], 'cover.png', { type: 'image/png' })

    await api.createBook({ title: 'Vue', year: 2024, authorIds: [1], cover })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(options.body).toBeInstanceOf(FormData)
    expect(options.body.get('title')).toBe('Vue')
    expect(options.body.get('author_ids[]')).toBe('1')
    expect(options.body.get('cover')).toBe(cover)
  })
})
