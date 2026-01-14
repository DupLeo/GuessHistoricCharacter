<template>
    <div class="score-container">
        <div class="score-item">
            📝 <span class="score-text">{{ indice }}</span>
        </div>
        <div class="score-item">
            👤 <span class="score-text">{{ nombre }}</span>
        </div>
        <div class="score-item jokers">
            🃏 <span class="score-text">{{ jokers }}</span>
        </div>
        <Button label="🔄 Recommencer" class="restart-btn" @click="$emit('reset')" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import Button from "primevue/button";

const props = defineProps({
    indice: String,
    nombre: Number,
    jokers: Number
});
const emit = defineEmits(['reset']);
</script>

<style scoped>
.score-container {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0.5rem;
}

.score-item {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #1976d2;
}

.jokers {
    color: #d32f2f;
}

.restart-btn {
    background: #1976d2;
    color: #fff;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
}

.restart-btn:hover {
    background: #115293;
}
</style>
