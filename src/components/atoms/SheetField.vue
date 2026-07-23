<script setup>
defineProps({
  field: {
    type: Object,
    required: true,
  },
  editMode: Boolean,
  selected: Boolean,
  dragging: Boolean,
});

defineEmits(["pointerdown", "edit"]);
</script>

<template>
  <span
    class="sheet-field"
    :class="{
      'is-selected': selected,
      'is-dragging': dragging,
    }"
    :data-field-id="field.id"
    :style="{
      left: `${field.x}%`,
      top: `${field.y}%`,
      fontSize: `${field.size ?? 2}cqw`,
    }"
    @pointerdown="$emit('pointerdown', $event, field)"
    @dblclick.stop.prevent="editMode && $emit('edit', field)"
  >
    {{ field.value }}
  </span>
</template>
