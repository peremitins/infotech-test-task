import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AuthorsView from './AuthorsView.vue'

describe('страница авторов', () => {
  it('обновляет список после поиска с задержкой без кнопки отправки', async () => {
    vi.useFakeTimers()
    const api = {
      getAuthors: vi.fn().mockResolvedValue({ items: [] }),
    }
    const auth = { isAuthenticated: { value: false } }
    const wrapper = mount(AuthorsView, {
      global: { provide: { api, auth } },
    })

    await flushPromises()
    expect(api.getAuthors).toHaveBeenCalledWith({ search: '', 'per-page': 100 })
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false)

    await wrapper.get('input').setValue('мартин')
    await vi.advanceTimersByTimeAsync(300)

    expect(api.getAuthors).toHaveBeenLastCalledWith({ search: 'мартин', 'per-page': 100 })
    vi.useRealTimers()
  })
})
