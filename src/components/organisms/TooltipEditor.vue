<script setup>
defineProps({
  open: Boolean,
  draft: {
    type: Object,
    required: true,
  },
  editing: Boolean,
});

defineEmits(["save", "delete", "cancel"]);
</script>

<template>
  <form
    v-if="open"
    id="tooltip-editor"
    class="field-editor"
    @submit.prevent="$emit('save')"
  >
    <h2>{{ editing ? "Modifier l’infobulle" : "Ajouter une infobulle" }}</h2>

    <label>
      Identifiant
      <input v-model="draft.id" type="text" required />
    </label>

    <label>
      Titre
      <input v-model="draft.title" type="text" autofocus />
    </label>

    <label>
      Texte
      <textarea v-model="draft.text" rows="5"></textarea>
    </label>

    <label>
      Largeur de la zone (%)
      <input v-model.number="draft.width" type="number" min="0.5" max="100" step="0.5" />
    </label>

    <label>
      Hauteur de la zone (%)
      <input v-model.number="draft.height" type="number" min="0.5" max="100" step="0.5" />
    </label>

    <div class="field-editor-coordinates">
      <span>x : {{ draft.x }}</span>
      <span>y : {{ draft.y }}</span>
    </div>

    <div class="field-editor-buttons">
      <button type="submit">
        {{ editing ? "Enregistrer" : "Ajouter" }}
      </button>
      <button v-if="editing" type="button" @click="$emit('delete')">
        Supprimer
      </button>
      <button type="button" @click="$emit('cancel')">Annuler</button>
    </div>
  </form>
</template>
