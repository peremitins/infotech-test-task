<template>
  <component
    :is="ordered ? 'ol' : 'ul'"
    class="entity-list"
    :class="{ 'entity-list--ordered': ordered }"
    :aria-label="ariaLabel || undefined"
  >
    <li v-if="!items.length" class="entity-list__empty">
      <slot name="empty">Ничего не найдено.</slot>
    </li>
    <template v-else>
      <li v-for="(item, index) in items" :key="getItemKey(item, index)" class="entity-list__item">
        <slot :item="item" :index="index" :position="index + 1" />
      </li>
    </template>
  </component>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  ordered: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  itemKey: {
    type: [String, Function],
    default: 'id',
  },
})

function getItemKey(item, index) {
  if (typeof props.itemKey === 'function') return props.itemKey(item, index)
  return item?.[props.itemKey] ?? index
}
</script>

<style scoped>
.entity-list {
  --entity-list-number-width: 3.25rem;

  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  list-style: none;
}

.entity-list--ordered {
  counter-reset: entity-list;
}

.entity-list__item {
  position: relative;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--line);
  counter-increment: entity-list;
  transition: background-color 0.2s ease;
}

.entity-list__item:last-child {
  border-bottom: 0;
}

.entity-list--ordered .entity-list__item {
  min-height: 3.75rem;
}

.entity-list--ordered .entity-list__item::before {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: var(--entity-list-number-width);
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 0.25rem 1rem 1rem;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  content: counter(entity-list) '.';
}

:deep(.entity-list__link) {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
  padding: 1rem 1.25rem;
  color: var(--ink);
  text-decoration: none;
  background: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.entity-list--ordered :deep(.entity-list__link) {
  padding-left: calc(var(--entity-list-number-width) + 0.75rem);
}

:deep(.entity-list__link:hover),
:deep(.entity-list__link:focus-visible) {
  color: var(--brand);
  background-color: #edf3ee;
}

:deep(.entity-list__link:focus-visible) {
  outline: 2px solid var(--brand);
  outline-offset: -2px;
}

:deep(.entity-list__title) {
  min-width: 0;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.entity-list__action) {
  flex: 0 0 auto;
  color: var(--ink-muted);
  font-size: 0.875rem;
}

.entity-list__empty {
  padding: 1.25rem;
  color: var(--ink-muted);
  list-style: none;
}

@media (max-width: 768px) {
  .entity-list {
    --entity-list-number-width: 2.5rem;
  }

  :deep(.entity-list__link) {
    padding: 0.875rem 1rem;
  }

  .entity-list--ordered .entity-list__item::before {
    padding: 0.875rem 0.2rem 0.875rem 0.75rem;
  }

  .entity-list--ordered :deep(.entity-list__link) {
    padding-left: calc(var(--entity-list-number-width) + 0.625rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .entity-list__item,
  :deep(.entity-list__link) {
    transition: none;
  }
}
</style>
