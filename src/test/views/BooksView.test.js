import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BooksView from '../../views/BooksView.vue'

const firstBook = {
  id: 1,
  title: 'Первая книга',
  year: 2024,
  authors: [],
}
const secondBook = {
  id: 2,
  title: 'Вторая книга',
  year: 2025,
  authors: [],
}

function deferred() {
  let resolve
  return {
    promise: new Promise((done) => {
      resolve = done
    }),
    resolve,
  }
}

function mountView(api) {
  return mount(BooksView, {
    global: {
      provide: {
        api,
        auth: { isAuthenticated: { value: false } },
      },
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
        AuthorMultiSelect: { template: '<div />' },
        BookCard: { props: ['book'], template: '<article>{{ book.title }}</article>' },
        BookPagination: {
          props: ['pagination'],
          emits: ['change'],
          template: '<button type="button" @click="$emit(\'change\', 2)">Следующая</button>',
        },
      },
    },
  })
}

describe('страница каталога', () => {
  it('подсвечивает сброс, если активен хотя бы один фильтр', async () => {
    const api = {
      getAuthors: vi.fn().mockResolvedValue({ items: [] }),
      getBooks: vi.fn().mockResolvedValue({
        items: [firstBook],
        pagination: { page: 1, per_page: 4, total_pages: 1 },
      }),
    }
    const wrapper = mountView(api)

    await flushPromises()
    await wrapper.get('#book-search').setValue('первая')

    expect(wrapper.get('[data-test="reset-filters"]').classes()).toContain('btn-filter-active')
  })

  it('оставляет текущие карточки видимыми во время загрузки следующей страницы', async () => {
    const nextPage = deferred()
    const api = {
      getAuthors: vi.fn().mockResolvedValue({ items: [] }),
      getBooks: vi
        .fn()
        .mockResolvedValueOnce({
          items: [firstBook],
          pagination: { page: 1, per_page: 4, total_pages: 2 },
        })
        .mockReturnValueOnce(nextPage.promise),
    }
    const wrapper = mountView(api)

    await flushPromises()
    expect(wrapper.text()).toContain('Первая книга')

    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('Первая книга')

    nextPage.resolve({
      items: [secondBook],
      pagination: { page: 2, per_page: 4, total_pages: 2 },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Вторая книга')
  })
})
