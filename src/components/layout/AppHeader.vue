<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="app-header__brand" :to="{ name: 'books' }">
        <span class="app-header__monogram" aria-hidden="true">К</span>
        <span>Книжный каталог</span>
      </RouterLink>

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
  z-index: 100;
  top: 0;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 254, 250, 0.92);
  backdrop-filter: blur(14px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: 5rem;
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.035em;
  text-decoration: none;
  white-space: nowrap;
}

.app-header__monogram {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 0.55rem;
  background: var(--brand);
  color: #fffefa;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.app-header__nav {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 0.35rem;
}

.app-header__link {
  position: relative;
  padding: 0.55rem 0.7rem;
  border-radius: 0.45rem;
  color: var(--ink-muted);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;
}

.app-header__link::after {
  position: absolute;
  right: 0.75rem;
  bottom: -0.15rem;
  left: 0.7rem;
  height: 2px;
  border-radius: 1px;
  background: var(--accent);
  content: '';
  opacity: 0;
  transform: scaleX(0.5);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.app-header__link:hover,
.app-header__link.router-link-active {
  color: var(--brand);
  background: #eef3ee;
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
  color: var(--ink-muted);
  font-size: 0.875rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .app-header__inner {
    flex-wrap: wrap;
    gap: 0.75rem;
    min-height: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .app-header__brand {
    font-size: 1.2rem;
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
    min-width: 0;
    overflow: hidden;
    padding: 0.55rem 0.25rem;
    font-size: 0.9375rem;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app-header__link::after {
    right: 0.5rem;
    left: 0.5rem;
  }

  .app-header__username {
    display: none;
  }
}

@media (max-width: 360px) {
  .app-header__link {
    font-size: 0.8125rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header__link::after {
    transition: none;
  }
}
</style>
