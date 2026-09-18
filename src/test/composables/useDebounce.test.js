import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from '../../composables/useDebounce'

describe('композабл задержки', () => {
  it('запускает только последнюю отложенную функцию после задержки', () => {
    vi.useFakeTimers()
    const debounce = useDebounce(300)
    const firstCallback = vi.fn()
    const lastCallback = vi.fn()

    debounce.schedule(firstCallback)
    debounce.schedule(lastCallback)
    vi.advanceTimersByTime(299)

    expect(firstCallback).not.toHaveBeenCalled()
    expect(lastCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)

    expect(firstCallback).not.toHaveBeenCalled()
    expect(lastCallback).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('отменяет запланированную функцию', () => {
    vi.useFakeTimers()
    const debounce = useDebounce(300)
    const callback = vi.fn()

    debounce.schedule(callback)
    debounce.cancel()
    vi.runAllTimers()

    expect(callback).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
