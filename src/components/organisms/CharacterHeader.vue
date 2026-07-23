<script setup>
import BackLink from "../atoms/BackLink.vue";

defineProps({
  characterName: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <header class="character-header">
    <BackLink />
    <h1>{{ characterName }}</h1>
    <slot name="actions"></slot>
  </header>
</template>
