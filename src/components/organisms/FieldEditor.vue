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
    id="field-editor"
    class="field-editor"
    @submit.prevent="$emit('save')"
  >
    <h2>{{ editing ? "Modifier le texte" : "Ajouter un texte" }}</h2>

    <label>
      Identifiant
      <input v-model="draft.id" type="text" required />
    </label>

    <label>
      Valeur
      <input v-model="draft.value" type="text" autofocus />
    </label>

    <label>
      Taille
      <input v-model.number="draft.size" type="number" min="0.1" step="0.1" />
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
