const RECIPIENTS_PER_REQUEST = 30

function normalizePhone(phone) {
  return String(phone).replace(/^\+/, '')
}

function splitIntoBatches(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  )
}

async function sendBatch(message, phones) {
  const body = new URLSearchParams({
    send: message,
    to: phones.join(','),
    format: 'json',
  })
  const response = await fetch(`/sms-api?${body}`)

  if (!response.ok) throw new Error('SMS Pilot вернул ошибку сети.')

  const payload = await response.json()
  if (payload.error || !Array.isArray(payload.send)) {
    throw new Error(payload.error?.description_ru ?? 'SMS Pilot не принял уведомление.')
  }

  return payload.send.map((item) => ({
    phone: String(item.phone),
    serverId: item.server_id ? String(item.server_id) : null,
    status: Number(item.status),
  }))
}

export async function sendNewBookNotifications(book, subscribers) {
  const phones = [...new Set(subscribers.map(({ phone }) => normalizePhone(phone)))].filter(Boolean)
  if (!phones.length) return { sent: 0, failed: 0, messages: [] }

  const message = `Новая книга: ${book.title}`
  const batches = splitIntoBatches(phones, RECIPIENTS_PER_REQUEST)
  const results = await Promise.allSettled(batches.map((batch) => sendBatch(message, batch)))
  const messages = results
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => result.value)
  const sent = messages.filter((item) => item.serverId && item.status >= 0).length

  return {
    sent,
    failed: phones.length - sent,
    messages: messages.filter((item) => item.serverId && item.status >= 0),
  }
}
