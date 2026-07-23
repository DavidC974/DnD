<script setup>
defineProps({
  characterName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  showTooltipZones: {
    type: Boolean,
    default: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["sheet-click"]);
</script>

<template>
  <div
    class="character-sheet"
    :class="{
      'hide-tooltip-zones': !showTooltipZones,
      'edit-mode': editMode,
    }"
    :aria-label="`Feuille de personnage de ${characterName}`"
    @click="$emit('sheet-click', $event)"
  >
    <img
      v-if="imageUrl"
      class="character-sheet__image"
      :src="imageUrl"
      :alt="`Feuille de personnage de ${characterName}`"
    />
    <slot></slot>
  </div>
</template>
