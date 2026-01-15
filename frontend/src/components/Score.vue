<template>
  <div class="score-container">
    <div class="score-item">
      📝 <span class="score-text">{{ cleanIndice(indice) }}</span>
    </div>
    <div class="score-item">
      👤 <span class="score-text">{{ nombre }}</span>
    </div>
    <div class="score-item jokers">
      🃏 <span class="score-text">{{ jokers }}</span>
    </div>
    <button class="restart-btn" @click="$emit('reset')">
      🔄 Recommencer
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  indice: String,
  nombre: Number,
  jokers: Number
});
const emit = defineEmits(["reset"]);

const cleanIndice = (text) => {
  if (!text) return "";
  return text.replace(/m2:/g, ""); // supprime toutes les occurrences de ":m2"
};
</script>

<style scoped>
.score-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.5rem 0;
  background: #fff;
}

.score-item {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: #41b883;
}

.jokers {
  color: #d32f2f;
}

.restart-btn {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  background: #41b883;
  color: #fff;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.restart-btn:hover {
  background: #339066;
}
</style>