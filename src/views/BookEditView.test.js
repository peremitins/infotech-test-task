import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BookEditView from './BookEditView.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ back: vi.fn(), push }),
}))

function mountView(api) {
  return mount(BookEditView, {
    global: {
      provide: { api },
      stubs: { AuthorPicker: { props: ['modelValue'], template: '<div />' } },
    },
  })
}

describe('форма книги', () => {
  it('создаёт заполненных новых авторов перед книгой и игнорирует пустые поля', async () => {
    const api = {
      getAuthors: vi.fn().mockResolvedValue({ items: [] }),
      createAuthor: vi.fn().mockResolvedValue({ id: 19, full_name: 'Иванов Иван' }),
      createBook: vi.fn().mockResolvedValue({ id: 7 }),
    }
    const wrapper = mountView(api)

    await flushPromises()
    await wrapper.get('#title').setValue('Новая книга')
    await wrapper.get('#year').setValue('2026')
    await wrapper.get('#new-author-0').setValue('  Иванов Иван  ')
    await wrapper.get('[data-test="add-new-author"]').trigger('click')
    const coverInput = wrapper.get('input[type="file"]').element
    Object.defineProperty(coverInput, 'files', {
      value: [new File(['cover'], 'cover.png', { type: 'image/png' })],
    })
    await wrapper.get('input[type="file"]').trigger('change')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(api.createAuthor).toHaveBeenCalledWith('Иванов Иван')
    expect(api.createBook).toHaveBeenCalledWith(expect.objectContaining({ authorIds: [19] }))
    expect(push).toHaveBeenCalledWith(expect.objectContaining({ name: 'book', params: { id: 7 } }))
  })
})
