<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="app-header__brand" :to="{ name: 'books' }">Книжный каталог</RouterLink>

      <nav class="app-header__nav" aria-label="Основная навигация">
        <RouterLink class="app-header__link" :to="{ name: 'books' }">Книги</RouterLink>
        <RouterLink class="app-header__link" :to="{ name: 'authors' }">Авторы</RouterLink>
        <RouterLink class="app-header__link" :to="{ name: 'report' }">Отчёт</RouterLink>
      </nav>

      <div class="app-header__account">
        <template v-if="isAuthenticated">
          <span class="app-header__username">{{ username }}</span>
          <button class="btn btn-outline-secondary btn-sm" type="button" @click="$emit('logout')">
            Выйти
          </button>
        </template>
        <RouterLink v-else class="btn btn-primary btn-sm" :to="{ name: 'login' }">Войти</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isAuthenticated: { type: Boolean, default: false },
  username: { type: String, default: '' },
})

defineEmits(['logout'])
</script>

<style scoped>
.app-header {
  position: sticky;
  z-index: 1020;
  top: 0;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 4.5rem;
}

.app-header__brand {
  color: #2563eb;
  font-size: 1.125rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.app-header__nav {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.25rem;
}

.app-header__link {
  position: relative;
  padding: 0.5rem 0.75rem;
  color: #475569;
  font-weight: 500;
  text-decoration: none;
}

.app-header__link::after {
  position: absolute;
  right: 0.75rem;
  bottom: 0.1rem;
  left: 0.75rem;
  height: 2px;
  border-radius: 999px;
  background: #2563eb;
  content: '';
  opacity: 0;
  transform: scaleX(0.5);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.app-header__link:hover,
.app-header__link.router-link-active {
  color: #1d4ed8;
}

.app-header__link.router-link-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.app-header__account {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.app-header__username {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 767.98px) {
  .app-header__inner {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    min-height: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .app-header__brand {
    font-size: 1rem;
  }

  .app-header__nav {
    display: flex;
    order: 3;
    flex-basis: 100%;
    justify-content: space-between;
    gap: 0;
  }

  .app-header__link {
    flex: 1 1 0;
    padding: 0.5rem 0.25rem;
    font-size: 0.9375rem;
    text-align: center;
    white-space: nowrap;
  }

  .app-header__link::after {
    right: 0.25rem;
    left: 0.25rem;
  }
}

@media (max-width: 359.98px) {
  .app-header__link {
    font-size: 0.8125rem;
  }

  .app-header__username {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header__link::after {
    transition: none;
  }
}
</style>
