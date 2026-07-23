<script setup>
const visible = defineModel({
  type: Boolean,
  default: true,
});
</script>

<template>
  <label class="header-checkbox">
    <input v-model="visible" type="checkbox" />
    InfoBulles
  </label>
</template>
