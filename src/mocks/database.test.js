import { beforeEach, describe, expect, it } from 'vitest'
import {
  createBook,
  createSubscription,
  getBooks,
  getSubscribersForAuthors,
  resetDatabase,
} from './database'

describe('демонстрационная база данных', () => {
  beforeEach(() => {
    localStorage.clear()
    resetDatabase()
  })

  it('фильтрует книги по поисковому запросу и сохраняет созданную книгу после перезагрузки', () => {
    const book = createBook({
      title: 'Чистый код',
      year: 2008,
      description: 'Практика разработки',
      isbn: '978-0-13-235088-4',
      authorIds: [1],
      coverUrl: 'https://example.com/cover.jpg',
    })

    expect(getBooks({ search: 'чистый' }).items).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: book.id })]),
    )

    resetDatabase()

    expect(getBooks({ search: 'чистый' }).items).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: book.id })]),
    )
  })

  it('возвращает одного подписчика на номер для нескольких выбранных авторов', () => {
    createSubscription({ authorId: 1, phone: '+79990000000' })
    createSubscription({ authorId: 2, phone: '+79990000000' })

    expect(getSubscribersForAuthors([1, 2])).toEqual([
      expect.objectContaining({ phone: '+79990000000' }),
    ])
  })

  it('возвращает по четыре разные книги на каждой странице каталога', () => {
    const firstPage = getBooks({ page: 1, perPage: 4 })
    const secondPage = getBooks({ page: 2, perPage: 4 })

    expect(firstPage.items).toHaveLength(4)
    expect(secondPage.items).toHaveLength(4)
    expect(secondPage.items.map((book) => book.id)).not.toEqual(
      firstPage.items.map((book) => book.id),
    )
    expect(secondPage.pagination).toMatchObject({ page: 2, per_page: 4 })
  })

  it('фильтрует книги по началу года', () => {
    const result = getBooks({ year: '20', perPage: 100 })

    expect(result.items).not.toHaveLength(0)
    expect(result.items.every((book) => String(book.year).startsWith('20'))).toBe(true)
  })

  it('возвращает книги, принадлежащие хотя бы одному выбранному автору', () => {
    const result = getBooks({ authorIds: [1, 2], perPage: 100 })

    expect(result.items).not.toHaveLength(0)
    expect(
      result.items.every((book) => book.authors.some((author) => [1, 2].includes(author.id))),
    ).toBe(true)
  })
})
