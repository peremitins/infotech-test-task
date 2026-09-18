import { describe, expect, it } from 'vitest'
import { getServiceWorkerUrl } from '../../mocks/serviceWorker'

describe('адрес сервис-воркера', () => {
  it('сохраняет базовый путь репозитория в сборке для публикации', () => {
    expect(getServiceWorkerUrl('/infotech-test-task/')).toBe(
      '/infotech-test-task/mockServiceWorker.js',
    )
  })
})
