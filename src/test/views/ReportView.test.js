import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ReportView from '../../views/ReportView.vue'

function mountView() {
  const api = {
    getBooks: vi.fn().mockResolvedValue({
      items: [{ year: 2026 }, { year: 2025 }, { year: 2024 }],
    }),
    getTopAuthors: vi.fn().mockResolvedValue({
      year: null,
      items: [{ author_id: 1, full_name: 'Роберт Мартин', books_count: 2 }],
    }),
  }

  return {
    api,
    wrapper: mount(ReportView, {
      global: {
        provide: { api },
        stubs: { RouterLink: RouterLinkStub },
      },
    }),
  }
}

describe('страница отчёта', () => {
  it('сразу загружает рейтинг за всё время и обновляет его после выбора года', async () => {
    vi.useFakeTimers()
    const { api, wrapper } = mountView()

    await flushPromises()
    expect(api.getTopAuthors).toHaveBeenCalledWith(undefined)
    expect(wrapper.get('select').element.value).toBe('')

    await wrapper.get('select').setValue('2025')
    await vi.advanceTimersByTimeAsync(300)

    expect(api.getTopAuthors).toHaveBeenLastCalledWith('2025')
    vi.useRealTimers()
  })

  it('запрашивает рейтинг за всё время после очистки выбранного года', async () => {
    vi.useFakeTimers()
    const { api, wrapper } = mountView()

    await flushPromises()
    await wrapper.get('select').setValue('')
    await vi.advanceTimersByTimeAsync(300)

    expect(api.getTopAuthors).toHaveBeenLastCalledWith(undefined)
    vi.useRealTimers()
  })

  it('связывает каждого автора со страницей автора', async () => {
    const { wrapper } = mountView()

    await flushPromises()

    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'author',
      params: { id: 1 },
    })
  })
})
