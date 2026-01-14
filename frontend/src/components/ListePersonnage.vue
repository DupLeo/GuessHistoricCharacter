<template>
    <div class="cards-wrapper">
        <Card v-for="(personnage, index) in gameData.personnages" :key="personnage.id" class="game-card"
            :class="getCardClass(index)" @click="selectPersonnage(index)">
            <template #header>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFyimxx6F8t71x42l5djN5dn4e8r6gOhyVtw&s"
                    alt="photo" class="card-image" />
            </template>
            <template #title>
                {{ personnage.name }}
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Card from "primevue/card";

const props = defineProps({
    gameData: Object,
    jokersRemaining: Number
});
const emit = defineEmits(["update-jokers", "game-over"]);

const selected = ref([]);
const wrongCount = ref(0);

watch(() => props.gameData, () => {
    selected.value = [];
    wrongCount.value = 0;
}, { deep: true });

const selectPersonnage = (index) => {
    if (selected.value.includes(index)) return;

    selected.value.push(index);

    if (!props.gameData.indices.includes(index)) {
        wrongCount.value++;
        emit("update-jokers", props.jokersRemaining - 1);
        if (wrongCount.value >= 2) emit("game-over", "lose");
    } else {
        emit("found-correct"); // <-- on décrémente le nombre restant

        // Vérification de la victoire complète maintenant gérée dans App.vue
    }
}


const getCardClass = (index) => {
    if (!selected.value.includes(index)) return '';
    return props.gameData.indices.includes(index) ? 'correct' : 'wrong';
}
</script>

<style scoped>
.cards-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin-top: 2rem;
}

.game-card {
    width: 160px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.card-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.game-card.correct {
    background-color: #c8e6c9;
    border: 2px solid #4caf50;
}

.game-card.wrong {
    background-color: #ffcdd2;
    border: 2px solid #f44336;
}

.game-card .p-card-title {
    text-align: center;
    font-weight: bold;
}
</style>
