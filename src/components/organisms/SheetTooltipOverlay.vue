<script setup>
import SheetTooltip from "../molecules/SheetTooltip.vue";

defineProps({
  tooltips: {
    type: Array,
    default: () => [],
  },
  editMode: Boolean,
  selectedItem: {
    type: Object,
    default: null,
  },
  draggedItem: {
    type: Object,
    default: null,
  },
});

defineEmits(["edit-item", "item-pointerdown"]);
</script>

<template>
  <div class="character-sheet__tooltips">
    <SheetTooltip
      v-for="tooltip in tooltips"
      :key="tooltip.id"
      :tooltip="tooltip"
      :edit-mode="editMode"
      :selected="selectedItem === tooltip"
      :dragging="draggedItem === tooltip"
      @pointerdown="
        (event, item) => $emit('item-pointerdown', event, item)
      "
      @edit="$emit('edit-item', $event)"
    />
  </div>
</template>
