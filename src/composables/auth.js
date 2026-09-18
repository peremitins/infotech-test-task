import { computed, ref } from 'vue'

const TOKEN_KEY = 'infotech-book-token'
const USER_KEY = 'infotech-book-user'

export function createAuth(api) {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'))

  async function login(credentials) {
    const session = await api.login(credentials)
    token.value = session.token
    user.value = session.user
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
    return session
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    isAuthenticated: computed(() => Boolean(token.value)),
    login,
    logout,
  }
}
