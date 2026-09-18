import { onBeforeUnmount } from 'vue'

export function useDebounce(delay = 300) {
  let timerId = null

  function cancel() {
    if (timerId === null) return
    window.clearTimeout(timerId)
    timerId = null
  }

  function schedule(callback) {
    cancel()
    timerId = window.setTimeout(() => {
      timerId = null
      callback()
    }, delay)
  }

  onBeforeUnmount(cancel)

  return { cancel, schedule }
}
