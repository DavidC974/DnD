<script setup>
import SheetField from "../atoms/SheetField.vue";

defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  characterName: {
    type: String,
    required: true,
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
  <div
    class="character-sheet__overlay"
    :aria-label="`Caractéristiques de ${characterName}`"
  >
    <SheetField
      v-for="field in fields"
      :key="field.id"
      :field="field"
      :edit-mode="editMode"
      :selected="selectedItem === field"
      :dragging="draggedItem === field"
      @pointerdown="
        (event, item) => $emit('item-pointerdown', event, item)
      "
      @edit="$emit('edit-item', $event)"
    />
  </div>
</template>
