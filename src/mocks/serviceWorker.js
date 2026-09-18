export function getServiceWorkerUrl(baseUrl) {
  return `${baseUrl.replace(/\/$/, '')}/mockServiceWorker.js`
}
