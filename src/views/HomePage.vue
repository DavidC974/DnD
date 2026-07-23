<script setup>
import { characters } from "../data/characters.js";
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <h1>Feuilles de personnages</h1>
      <p>Choisissez un personnage pour afficher sa feuille et ses capacités.</p>
    </header>

    <nav
      class="character-grid"
      aria-label="Liens vers les fiches de personnages"
    >
      <RouterLink
        v-for="character in characters"
        :key="character.id"
        class="character-card"
        :to="{ name: 'character', params: { id: character.id } }"
      >
        {{ character.name }}
      </RouterLink>
    </nav>
  </main>
</template>
