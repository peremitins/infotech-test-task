<template>
  <AppHeader
    :is-authenticated="auth.isAuthenticated.value"
    :username="auth.user.value?.username"
    @logout="logout"
  />

  <main class="container py-4">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in" appear>
        <div :key="route.fullPath" class="page-view">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </main>
</template>

<script setup>
import { inject } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'

const auth = inject('auth')
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
