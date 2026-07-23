<script setup>
defineProps({
  tooltip: {
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
  <div
    class="sheet-tooltip-zone"
    :class="{
      'is-selected': selected,
      'is-dragging': dragging,
    }"
    :data-tooltip-id="tooltip.id"
    :aria-label="`${tooltip.title || 'Information'} : ${tooltip.text || ''}`"
    :style="{
      left: `${tooltip.x}%`,
      top: `${tooltip.y}%`,
      width: `${tooltip.width ?? 4}%`,
      height: `${tooltip.height ?? 4}%`,
    }"
    tabindex="0"
    @pointerdown="$emit('pointerdown', $event, tooltip)"
    @dblclick.stop.prevent="editMode && $emit('edit', tooltip)"
  >
    <div class="sheet-tooltip-content">
      <strong v-if="tooltip.title" class="sheet-tooltip-title">
        {{ tooltip.title }}
      </strong>
      <span>{{ tooltip.text ?? "" }}</span>
    </div>
  </div>
</template>
