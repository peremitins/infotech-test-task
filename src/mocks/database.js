const STORAGE_KEY = 'infotech-book-catalog-data'
const SEED_VERSION = 4

const seed = {
  seed_version: SEED_VERSION,
  authors: [
    { id: 1, full_name: 'Роберт Мартин' },
    { id: 2, full_name: 'Мартин Фаулер' },
    { id: 3, full_name: 'Эрих Гамма' },
    { id: 4, full_name: 'Дональд Кнут' },
  ],
  books: [
    {
      id: 1,
      title: 'Тот самый разработчик',
      year: 2008,
      description: 'Николай Перемитин: разработчик, которого вы искали.',
      isbn: '978-0-13-235088-4',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [1],
    },
    {
      id: 2,
      title: 'Правильный найм',
      year: 2018,
      description: 'Почему стоит нанять Николая Перемитина.',
      isbn: '978-0-13-475759-9',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [2],
    },
    {
      id: 3,
      title: 'Лучшие разработчики',
      year: 1994,
      description: 'Перемитин Николай и другие лучшие программисты для вашей команды.',
      isbn: '978-0-201-63361-0',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [3],
    },
    {
      id: 4,
      title: 'Чистый код',
      year: 1968,
      description: 'Николай Перемитин: еще один разработчик, который любит чистый код.',
      isbn: '978-0-201-89683-1',
      cover_url:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
      author_ids: [4],
    },
    {
      id: 5,
      title: 'Не сломать production',
      year: 2004,
      description: 'Как не сломать production вместе с Николаем Перемитиным.',
      isbn: '978-0-7356-1967-8',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [2],
    },
    {
      id: 6,
      title: 'Пятничный релиз',
      year: 1999,
      description: 'Как пережить пятничный релиз с Николаем Перемитиным.',
      isbn: '978-0-13-595705-9',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [1],
    },
    {
      id: 7,
      title: 'Быстрый интерфейс',
      year: 2017,
      description: 'Николай Перемитин и интерфейс, который не тормозит.',
      isbn: '978-5-699-95210-7',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [4],
    },
    {
      id: 8,
      title: 'Закрыть вакансию',
      year: 2018,
      description: 'Николай Перемитин и другие способы закрыть вакансию.',
      isbn: '978-5-4461-0923-3',
      cover_url:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
      author_ids: [3],
    },
    {
      id: 9,
      title: 'Компьютерные сети',
      year: 2013,
      description: 'Основы сетевых протоколов и распределённых систем.',
      isbn: '978-5-8459-1863-0',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [4],
    },
    {
      id: 10,
      title: 'Проектирование веб-API',
      year: 2020,
      description: 'Практика создания надёжных REST API.',
      isbn: '978-1-4920-4045-2',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [2],
    },
    {
      id: 11,
      title: 'Чистая архитектура',
      year: 2017,
      description: 'Правила и практики построения поддерживаемых систем.',
      isbn: '978-5-4461-0636-2',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [1],
    },
    {
      id: 12,
      title: 'Разработка через тестирование',
      year: 2002,
      description: 'Подход к проектированию кода через автоматические тесты.',
      isbn: '978-0-321-14653-3',
      cover_url:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
      author_ids: [3],
    },
    {
      id: 13,
      title: 'JavaScript: сильные стороны',
      year: 2008,
      description: 'Ключевые идеи и выразительные возможности JavaScript.',
      isbn: '978-0-596-51774-8',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [3],
    },
    {
      id: 14,
      title: 'Алгоритмы: построение и анализ',
      year: 2009,
      description: 'Систематическое изложение алгоритмов и их анализа.',
      isbn: '978-5-8459-1619-3',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [4],
    },
    {
      id: 15,
      title: 'Практики командной разработки',
      year: 2021,
      description: 'Подходы к совместной разработке, ревью и качеству кода.',
      isbn: '978-5-00146-510-4',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [1, 2],
    },
    {
      id: 16,
      title: 'Паттерны для современных приложений',
      year: 2022,
      description: 'Сборник практик проектирования от нескольких авторов.',
      isbn: '978-5-00169-921-9',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [3, 4],
    },
    {
      id: 17,
      title: 'Архитектура веб-приложений',
      year: 2026,
      description: 'Практика проектирования устойчивых интерфейсов и API.',
      isbn: '978-5-00169-922-6',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [1, 2],
    },
    {
      id: 18,
      title: 'Системный дизайн для фронтенда',
      year: 2026,
      description: 'Как выбирать архитектурные решения для сложных клиентских приложений.',
      isbn: '978-5-00169-923-3',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [2],
    },
    {
      id: 19,
      title: 'Надёжный JavaScript',
      year: 2026,
      description: 'Работа с ошибками, асинхронностью и качеством кода.',
      isbn: '978-5-00169-924-0',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [1, 3],
    },
    {
      id: 20,
      title: 'Практика UI-компонентов',
      year: 2025,
      description: 'Подходы к созданию переиспользуемых компонентов интерфейса.',
      isbn: '978-5-00169-925-7',
      cover_url:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
      author_ids: [1],
    },
    {
      id: 21,
      title: 'Проектирование данных',
      year: 2024,
      description: 'Основы моделирования данных для прикладных систем.',
      isbn: '978-5-00169-926-4',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [4],
    },
    {
      id: 22,
      title: 'Алгоритмы на практике',
      year: 2023,
      description: 'Подбор и анализ алгоритмов в повседневной разработке.',
      isbn: '978-5-00169-927-1',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [3, 4],
    },
    {
      id: 23,
      title: 'Командная инженерия',
      year: 2022,
      description: 'Ревью, договорённости и предсказуемая поставка продукта.',
      isbn: '978-5-00169-928-8',
      cover_url:
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80',
      author_ids: [1, 2, 3],
    },
    {
      id: 24,
      title: 'Безопасность веб-интерфейсов',
      year: 2021,
      description: 'Базовые угрозы и практики защиты браузерных приложений.',
      isbn: '978-5-00169-929-5',
      cover_url:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
      author_ids: [2, 4],
    },
    {
      id: 25,
      title: 'Тестирование интерфейсов',
      year: 2020,
      description: 'Unit-, интеграционные и e2e-проверки фронтенда.',
      isbn: '978-5-00169-930-1',
      cover_url:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
      author_ids: [3],
    },
    {
      id: 26,
      title: 'Современный CSS',
      year: 2019,
      description: 'Адаптивные интерфейсы, сетки и поддерживаемые стили.',
      isbn: '978-5-00169-931-8',
      cover_url:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
      author_ids: [1, 3],
    },
  ],
  subscriptions: [],
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function readState() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    const state = clone(seed)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return state
  }

  const state = JSON.parse(saved)
  if (!state.seed_version || state.seed_version < SEED_VERSION) {
    const existingIds = new Set(state.books.map((book) => book.id))
    state.books.push(...seed.books.filter((book) => !existingIds.has(book.id)))
    state.seed_version = SEED_VERSION
    writeState(state)
  }

  return state
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function nextId(items) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}

function bookWithAuthors(book, authors) {
  return {
    id: book.id,
    title: book.title,
    year: book.year,
    description: book.description,
    isbn: book.isbn,
    cover_url: book.cover_url,
    authors: book.author_ids
      .map((authorId) => authors.find((author) => author.id === authorId))
      .filter(Boolean)
      .map(({ id, full_name }) => ({ id, full_name })),
  }
}

function authorWithBooks(author, books) {
  return {
    id: author.id,
    full_name: author.full_name,
    books: books
      .filter((book) => book.author_ids.includes(author.id))
      .map(({ id, title, year }) => ({ id, title, year })),
  }
}

export function resetDatabase() {
  return readState()
}

export function getBooks({ page = 1, perPage = 8, authorId, authorIds = [], year, search } = {}) {
  const state = readState()
  const normalizedPerPage = Math.max(Number(perPage) || 8, 1)
  const normalizedSearch = search?.trim().toLocaleLowerCase('ru-RU') ?? ''
  const normalizedAuthorIds = [...authorIds, authorId]
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map(Number)
  let books = state.books

  if (normalizedAuthorIds.length) {
    books = books.filter((book) => book.author_ids.some((id) => normalizedAuthorIds.includes(id)))
  }
  if (year) books = books.filter((book) => String(book.year).startsWith(String(year)))
  if (normalizedSearch) {
    books = books.filter((book) => {
      const authorNames = book.author_ids
        .map((id) => state.authors.find((author) => author.id === id)?.full_name ?? '')
        .join(' ')
      return `${book.title} ${book.description} ${authorNames}`
        .toLocaleLowerCase('ru-RU')
        .includes(normalizedSearch)
    })
  }

  const total = books.length
  const totalPages = Math.max(1, Math.ceil(total / normalizedPerPage))
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages)
  const start = (currentPage - 1) * normalizedPerPage

  return {
    items: books
      .slice(start, start + normalizedPerPage)
      .map((book) => bookWithAuthors(book, state.authors)),
    pagination: {
      total,
      page: currentPage,
      per_page: normalizedPerPage,
      total_pages: totalPages,
    },
  }
}

export function getBook(id) {
  const state = readState()
  const book = state.books.find((item) => item.id === Number(id))
  return book ? bookWithAuthors(book, state.authors) : null
}

export function createBook({ title, year, description = '', isbn = '', authorIds, coverUrl }) {
  const state = readState()
  const book = {
    id: nextId(state.books),
    title,
    year: Number(year),
    description,
    isbn,
    author_ids: authorIds.map(Number),
    cover_url: coverUrl,
  }
  state.books.push(book)
  writeState(state)
  return bookWithAuthors(book, state.authors)
}

export function updateBook(id, changes) {
  const state = readState()
  const book = state.books.find((item) => item.id === Number(id))
  if (!book) return null

  Object.assign(book, {
    ...(changes.title !== undefined && { title: changes.title }),
    ...(changes.year !== undefined && { year: Number(changes.year) }),
    ...(changes.description !== undefined && { description: changes.description }),
    ...(changes.isbn !== undefined && { isbn: changes.isbn }),
    ...(changes.authorIds !== undefined && { author_ids: changes.authorIds.map(Number) }),
    ...(changes.coverUrl !== undefined && { cover_url: changes.coverUrl }),
  })
  writeState(state)
  return bookWithAuthors(book, state.authors)
}

export function deleteBook(id) {
  const state = readState()
  const index = state.books.findIndex((book) => book.id === Number(id))
  if (index === -1) return false
  state.books.splice(index, 1)
  writeState(state)
  return true
}

export function getAuthors({ page = 1, perPage = 20, search } = {}) {
  const state = readState()
  const normalizedPerPage = Math.max(Number(perPage) || 20, 1)
  const normalizedSearch = search?.trim().toLocaleLowerCase('ru-RU') ?? ''
  const authors = normalizedSearch
    ? state.authors.filter((author) =>
        author.full_name.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
      )
    : state.authors
  const total = authors.length
  const totalPages = Math.max(1, Math.ceil(total / normalizedPerPage))
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages)
  const start = (currentPage - 1) * normalizedPerPage

  return {
    items: authors
      .slice(start, start + normalizedPerPage)
      .map(({ id, full_name }) => ({ id, full_name })),
    pagination: {
      total,
      page: currentPage,
      per_page: normalizedPerPage,
      total_pages: totalPages,
    },
  }
}

export function getAuthor(id) {
  const state = readState()
  const author = state.authors.find((item) => item.id === Number(id))
  return author ? authorWithBooks(author, state.books) : null
}

export function createAuthor(fullName) {
  const state = readState()
  const author = { id: nextId(state.authors), full_name: fullName }
  state.authors.push(author)
  writeState(state)
  return authorWithBooks(author, state.books)
}

export function updateAuthor(id, fullName) {
  const state = readState()
  const author = state.authors.find((item) => item.id === Number(id))
  if (!author) return null
  author.full_name = fullName
  writeState(state)
  return authorWithBooks(author, state.books)
}

export function deleteAuthor(id) {
  const state = readState()
  const authorId = Number(id)
  if (state.books.some((book) => book.author_ids.includes(authorId))) return 'has-books'
  const index = state.authors.findIndex((author) => author.id === authorId)
  if (index === -1) return false
  state.authors.splice(index, 1)
  state.subscriptions = state.subscriptions.filter(
    (subscription) => subscription.authorId !== authorId,
  )
  writeState(state)
  return true
}

export function getTopAuthors(year) {
  const state = readState()
  const counts = new Map()
  state.books
    .filter((book) => !year || book.year === Number(year))
    .forEach((book) =>
      book.author_ids.forEach((authorId) => counts.set(authorId, (counts.get(authorId) ?? 0) + 1)),
    )

  return [...counts.entries()]
    .map(([authorId, booksCount]) => ({
      author_id: authorId,
      full_name:
        state.authors.find((author) => author.id === authorId)?.full_name ?? 'Неизвестный автор',
      books_count: booksCount,
    }))
    .sort(
      (left, right) =>
        right.books_count - left.books_count || left.full_name.localeCompare(right.full_name, 'ru'),
    )
    .slice(0, 10)
    .map((author, index) => ({ rank: index + 1, ...author }))
}

export function createSubscription({ authorId, phone }) {
  const state = readState()
  const subscription = { id: nextId(state.subscriptions), authorId: Number(authorId), phone }
  state.subscriptions.push(subscription)
  writeState(state)
  return subscription
}

export function getSubscribersForAuthors(authorIds) {
  const ids = new Set(authorIds.map(Number))
  const uniquePhones = new Set()
  return readState().subscriptions.filter((subscription) => {
    if (!ids.has(subscription.authorId) || uniquePhones.has(subscription.phone)) return false
    uniquePhones.add(subscription.phone)
    return true
  })
}
