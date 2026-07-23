<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
  tooltipMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["export", "toggle-edit", "toggle-tooltip"]);
</script>

<template>
  <div
    class="sheet-editor-toolbar"
    :class="{ 'toolbar-visible': visible }"
    aria-label="Outils d’édition de la fiche"
  >
    <button
      id="toggle-edit-mode"
      type="button"
      :class="{ 'is-active': editMode }"
      @click="$emit('toggle-edit')"
    >
      {{ editMode ? "Désactiver le mode édition" : "Activer le mode édition" }}
    </button>
    <button
      id="toggle-tooltip-mode"
      type="button"
      :disabled="!editMode"
      :class="{ 'is-active': tooltipMode }"
      @click="$emit('toggle-tooltip')"
    >
      Ajouter une info-bulle
    </button>
    <button id="export-config" type="button" @click="$emit('export')">
      Exporter la configuration
    </button>
  </div>
</template>
