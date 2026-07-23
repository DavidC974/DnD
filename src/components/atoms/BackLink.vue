<script setup>
defineProps({
  to: {
    type: [String, Object],
    default: () => ({ name: "home" }),
  },
});
</script>

<template>
  <RouterLink class="back-link" :to="to">
    <slot>Retour à l’accueil</slot>
  </RouterLink>
</template>
