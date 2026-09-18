<template>
  <EntityList :items="authors" aria-label="Список авторов">
    <template #default="{ item: author }">
      <RouterLink class="entity-list__link" :to="{ name: 'author', params: { id: author.id } }">
        <span class="entity-list__title">{{ author.full_name }}</span>
        <span class="entity-list__action">Открыть</span>
      </RouterLink>
    </template>
    <template #empty>Авторы не найдены.</template>
  </EntityList>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import EntityList from '../common/EntityList.vue'

defineProps({
  authors: {
    type: Array,
    default: () => [],
  },
})
</script>
