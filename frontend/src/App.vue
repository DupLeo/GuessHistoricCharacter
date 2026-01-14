<script setup>
import { ref } from "vue";
import Score from "./components/Score.vue";
import ListePersonnage from "./components/ListePersonnage.vue";

// État du jeu
const gameData = ref(null);
const loading = ref(false);
const gameOver = ref(false);
const gameResult = ref(""); // "win" ou "lose"

// Nombre de jokers max
const maxJokers = 2;
const jokersRemaining = ref(maxJokers);

// Nombre de personnages restants à trouver
const remainingToFind = ref(0);

// Fonction pour récupérer les données depuis le serveur
const fetchGameData = async () => {
  loading.value = true;
  gameOver.value = false;
  gameResult.value = "";
  jokersRemaining.value = maxJokers;

  try {
    const response = await fetch("http://localhost:3000/lunch-game");
    if (!response.ok) throw new Error("Erreur lors de la récupération des données");

    const data = await response.json();
    gameData.value = data;
    remainingToFind.value = gameData.value.indices.length;
  } catch (err) {
    console.error(err);
    alert("Impossible de récupérer les données du serveur.");
  } finally {
    loading.value = false;
  }
};

// Initialisation
fetchGameData();

// Reset du jeu
const resetGame = async () => {
  await fetchGameData();
};

// Fin du jeu
const endGame = (result) => {
  gameOver.value = true;
  gameResult.value = result;
};

// Décrémente le nombre restant si on trouve un personnage correct
const decrementRemaining = () => {
  remainingToFind.value--;
  if (remainingToFind.value <= 0) {
    endGame("win");
  }
};
</script>


<template>
  <header>
    <Score v-if="gameData" :indice="gameData.indiceText" :nombre="remainingToFind" :jokers="jokersRemaining"
      @reset="resetGame" />
  </header>

  <main>
    <div v-if="loading">Chargement des données...</div>

    <ListePersonnage v-if="gameData && !gameOver" :gameData="gameData" :jokersRemaining="jokersRemaining"
      @update-jokers="val => jokersRemaining = val" @found-correct="decrementRemaining" @game-over="endGame" />

    <div v-if="gameOver" class="end-screen">
      <h2 v-if="gameResult === 'win'">🎉 Vous avez gagné ! 🎉</h2>
      <h2 v-else>❌ Vous avez perdu ! ❌</h2>
      <button class="restart-btn" @click="resetGame">🔄 Recommencer</button>
    </div>
  </main>
</template>


<style scoped>
.app-container {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffffee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-direction: column;
}

.loading {
  font-size: 1.5rem;
  color: #1976d2;
}

.end-screen {
  text-align: center;
}

.end-screen h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1976d2;
}

.restart-btn {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.2s all;
}

.restart-btn:hover {
  background: #115293;
}
</style>
