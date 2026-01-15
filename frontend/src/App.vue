<script setup>
import { ref, onMounted } from "vue";
import Score from "./components/Score.vue";
import ListePersonnage from "./components/ListePersonnage.vue";

/* -------------------- ÉTAT DU JEU -------------------- */
const gameData = ref(null);
const loading = ref(false);
const gameOver = ref(false);
const gameResult = ref(""); // "win" | "lose"

/* -------------------- JOKERS -------------------- */
const MAX_JOKERS = 2;
const jokersRemaining = ref(MAX_JOKERS);

/* -------------------- OBJECTIF -------------------- */
const remainingToFind = ref(0);
const correctPersonnages = ref([]);

/* -------------------- FETCH BACKEND -------------------- */
const fetchGameData = async () => {
  loading.value = true;
  gameOver.value = false;
  gameResult.value = "";
  jokersRemaining.value = MAX_JOKERS;

  try {
    const response = await fetch("http://localhost:3000/lunch-game");
    if (!response.ok) throw new Error("Erreur serveur");

    const data = await response.json();
    gameData.value = data;

    remainingToFind.value = data.indices.length;

    correctPersonnages.value = data.indices.map(
      index => data.personnages[index]
    );

  } catch (err) {
    console.error(err);
    alert("Impossible de récupérer les données du serveur");
  } finally {
    loading.value = false;
  }
};

/* -------------------- LIFECYCLE -------------------- */
onMounted(fetchGameData);

/* -------------------- ACTIONS -------------------- */
const resetGame = async () => await fetchGameData();
const endGame = (result) => {
  gameOver.value = true;
  gameResult.value = result;
};
const decrementRemaining = () => {
  remainingToFind.value--;
  if (remainingToFind.value <= 0) endGame("win");
};
</script>

<template>
  <div class="app-container">
    <!-- SCORE -->
    <header v-if="gameData">
      <Score
        :indice="gameData.indiceText"
        :nombre="remainingToFind"
        :jokers="jokersRemaining"
        @reset="resetGame"
      />
    </header>

    <!-- CONTENU -->
    <main>
      <div v-if="loading" class="loading">
        ⏳ Chargement de la partie...
      </div>

      <ListePersonnage
        v-if="gameData && !gameOver"
        :gameData="gameData"
        :jokersRemaining="jokersRemaining"
        @update-jokers="val => jokersRemaining = val"
        @found-correct="decrementRemaining"
        @game-over="endGame"
      />

      <div v-if="gameOver" class="end-screen">
        <h2 :class="gameResult === 'win' ? 'win' : 'lose'">
          {{ gameResult === 'win' ? '🎉 Vous avez gagné !' : '❌ Vous avez perdu' }}
        </h2>

        <h3 class="reveal-title">🎯 Personnages à trouver</h3>

        <div class="reveal-cards">
          <div v-for="p in correctPersonnages" :key="p.id" class="reveal-card">
            👤 {{ p.name }}
          </div>
        </div>

        <button class="restart-btn" @click="resetGame">
          🔄 Rejouer
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

/* HEADER */
header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 0.5rem 2rem;
}

/* MAIN */
main {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* LOADING */
.loading {
  font-size: 1.4rem;
  font-weight: 500;
  color: #41b883;
}

/* END SCREEN */
.end-screen {
  text-align: center;
}

.win {
  color: #41b883;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.lose {
  color: #d32f2f;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.reveal-title {
  margin: 1rem 0 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
}

/* CARDS */
.reveal-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.reveal-card {
  min-width: 160px;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  background-color: #41b883;
  color: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  text-align: center;
  transition: transform 0.2s;
}

.reveal-card:hover {
  transform: translateY(-3px);
}

/* BUTTON */
.restart-btn {
  font-size: 1.1rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 2rem;
  background-color: #41b883;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.restart-btn:hover {
  background-color: #339066;
  transform: scale(1.05);
}
</style>
