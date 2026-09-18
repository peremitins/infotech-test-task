import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendNewBookNotifications } from '../../services/sms'

describe('СМС-уведомления', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('отправляет уникальные номера подписчиков одним запросом', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            send: [
              { phone: '79990000000', server_id: '101', status: '0' },
              { phone: '79991111111', server_id: '102', status: '0' },
            ],
          }),
          { status: 200 },
        ),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await sendNewBookNotifications({ title: 'Новая книга' }, [
      { phone: '+79990000000' },
      { phone: '+79990000000' },
      { phone: '+79991111111' },
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const request = new URL(fetchMock.mock.calls[0][0], 'http://localhost')
    expect(request.pathname).toBe('/sms-api')
    expect(request.searchParams.get('to')).toBe('79990000000,79991111111')
    expect(result).toMatchObject({ sent: 2, failed: 0 })
  })

  it('возвращает идентификаторы сервера и отдельно считает отклонённые номера', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              send: [
                { phone: '79990000000', server_id: '101', status: '0' },
                { phone: '79991111111', status: '-1', error: 'Недоступен' },
              ],
            }),
            { status: 200 },
          ),
        ),
      ),
    )

    const result = await sendNewBookNotifications({ title: 'Новая книга' }, [
      { phone: '+79990000000' },
      { phone: '+79991111111' },
    ])

    expect(result).toMatchObject({ sent: 1, failed: 1 })
    expect(result.messages).toEqual([
      expect.objectContaining({ phone: '79990000000', serverId: '101', status: 0 }),
    ])
  })

  it('считает ответ API с ошибкой неотправленным уведомлением', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: { code: '111', description_ru: 'Неправильный номер телефона' },
            }),
            { status: 200 },
          ),
        ),
      ),
    )

    const result = await sendNewBookNotifications({ title: 'Новая книга' }, [
      { phone: '+79990000000' },
    ])

    expect(result).toMatchObject({ sent: 0, failed: 1, messages: [] })
  })
})
