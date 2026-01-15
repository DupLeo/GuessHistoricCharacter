<template>
  <div class="cards-wrapper">
    <Card
      v-for="(personnage, index) in gameData.personnages"
      :key="personnage.id"
      class="game-card"
      :class="getCardClass(index)"
      @click="selectPersonnage(index)"
    >
      <template #header>
        <img
          :src="personnagesImages[personnage.name] || defaultImage"
          alt="photo"
          class="card-image"
        />
      </template>
      <template #title>{{ personnage.name }}</template>
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
const emit = defineEmits(["update-jokers", "found-correct", "game-over"]);

// Image par défaut si pas trouvée
const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/300px-No-Image-Placeholder.svg.png";

const personnagesImages =
{
  "Léonard de Vinci": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Francesco_Melzi_-_Portrait_of_Leonardo.png/500px-Francesco_Melzi_-_Portrait_of_Leonardo.png",
  "Cléopâtre": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cleopatra_VII%2C_dalla_via_appia_tra_ariccia_e_genzano%2C_40-30_ac_ca._02.JPG/330px-Cleopatra_VII%2C_dalla_via_appia_tra_ariccia_e_genzano%2C_40-30_ac_ca._02.JPG",
  "Albert Einstein": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Albert_Einstein_Head_cleaned.jpg/500px-Albert_Einstein_Head_cleaned.jpg",
  "Jeanne d'Arc": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Contemporaine_afb_jeanne_d_arc.png/500px-Contemporaine_afb_jeanne_d_arc.png",
  "Gengis Khan": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/YuanEmperorAlbumGenghisPortrait.jpg/330px-YuanEmperorAlbumGenghisPortrait.jpg",
  "Kubilai Khan": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Kublai_Khan_Emperor_of_China.jpg/300px-Kublai_Khan_Emperor_of_China.jpg",
  "Marco Polo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Marco_Polo_Mosaic_from_Palazzo_Tursi.jpg/500px-Marco_Polo_Mosaic_from_Palazzo_Tursi.jpg",
  "Frida Kahlo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/330px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
  "Martin Luther King Jr.": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/500px-Martin_Luther_King%2C_Jr..jpg",
  "Nikola Tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tesla_Sarony.jpg/330px-Tesla_Sarony.jpg",
  "Napoléon Bonaparte": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project_2.jpg/330px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project_2.jpg",
  "Anne Frank": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/AnneFrankSchoolPhoto.jpg/500px-AnneFrankSchoolPhoto.jpg",
  "Marie Curie": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/500px-Marie_Curie_c1920.jpg",
  "César": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg/500px-Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg",
  "Vercingétorix": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vercing%C3%A9torix_stat%C3%A8re_Gallica_avers.jpg/500px-Vercing%C3%A9torix_stat%C3%A8re_Gallica_avers.jpg",
  "Alexandre le Grand": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alexander_the_Great%2C_from_Alexandria%2C_Egypt%2C_3rd_cent._BCE%2C_Ny_Carlsberg_Glyptotek%2C_Copenhagen_%285%29_%2836375553176%29.jpg/330px-Alexander_the_Great%2C_from_Alexandria%2C_Egypt%2C_3rd_cent._BCE%2C_Ny_Carlsberg_Glyptotek%2C_Copenhagen_%285%29_%2836375553176%29.jpg",
  "Qin Shi Huang": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Qinshihuang.jpg/500px-Qinshihuang.jpg",
  "William Shakespeare": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/500px-Shakespeare.jpg",
  "Sun Tzu": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Enchoen27n3200.jpg/500px-Enchoen27n3200.jpg",
  "Pythagore": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kapitolinischer_Pythagoras_adjusted.jpg/449px-Kapitolinischer_Pythagoras_adjusted.jpg",
  "Marie-Antoinette": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marie-Antoinette%3B_koningin_der_FransenFXD.jpg/500px-Marie-Antoinette%3B_koningin_der_FransenFXD.jpg",
  "Isaac Newton": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/500px-GodfreyKneller-IsaacNewton-1689.jpg",
  "Molière": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Moli%C3%A8re_-_Nicolas_Mignard_%281658%29.jpg/500px-Moli%C3%A8re_-_Nicolas_Mignard_%281658%29.jpg",
  "Nelson Mandela": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/330px-Nelson_Mandela_1994.jpg",
  "George Washington": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/330px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg",
  "Confucius": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Konfuzius-1770.jpg/500px-Konfuzius-1770.jpg",
  "Christophe Colomb": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ridolfo_del_Ghirlandaio_-_Ritratto_di_Cristoforo_Colombo_%281520%29.jpg/500px-Ridolfo_del_Ghirlandaio_-_Ritratto_di_Cristoforo_Colombo_%281520%29.jpg",
  "Géronimo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Geronimo_agn_1913.jpg/500px-Geronimo_agn_1913.jpg",
  "Aristote": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Aristoteles_Louvre.jpg/500px-Aristoteles_Louvre.jpg",
  "Michel-Ange": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Michelangelo_Daniele_da_Volterra_%28dettaglio%29.jpg/500px-Michelangelo_Daniele_da_Volterra_%28dettaglio%29.jpg",
  "Joseph Staline": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Joseph_Stalin_official_portrait.jpg/330px-Joseph_Stalin_official_portrait.jpg",
  "Adolf Hitler": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg/330px-Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg",
  "Mao Zedong": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mao_Tse_Tung.jpg/330px-Mao_Tse_Tung.jpg",
  "Soliman le Magnifique": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/EmperorSuleiman.jpg/330px-EmperorSuleiman.jpg",
  "Jules Ferry": "https://upload.wikimedia.org/wikipedia/commons/5/57/Julesferry.jpg",
  "Copernic": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nikolaus_Kopernikus.jpg/500px-Nikolaus_Kopernikus.jpg",
  "Néron": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Nero-portrait.jpg/300px-Nero-portrait.jpg",
  "Périclès": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Pericles_Pio-Clementino_Inv269.jpg/500px-Pericles_Pio-Clementino_Inv269.jpg",
  "Auguste": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Glyptothek_M%C3%BCnchen_%E2%80%93_18.04.2022_%E2%80%93_Augustus_Bevilacqua_%284%29.jpg/500px-Glyptothek_M%C3%BCnchen_%E2%80%93_18.04.2022_%E2%80%93_Augustus_Bevilacqua_%284%29.jpg",
  "Abraham Lincoln": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/330px-Abraham_Lincoln_O-77_matte_collodion_print.jpg",
  "Attila": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Eugene_Ferdinand_Victor_Delacroix_Attila_fragment.jpg/330px-Eugene_Ferdinand_Victor_Delacroix_Attila_fragment.jpg",
  "Mansa Moussa": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Kanga_Moussa_Atlas_Catalan.jpg/330px-Kanga_Moussa_Atlas_Catalan.jpg",
  "Galilée": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg/500px-Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg",
  "Leon Trotsky": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/%D0%9B%D0%B5%D0%B2_%D0%94%D0%B0%D0%B2%D0%B8%D0%B4%D0%BE%D0%B2%D0%B8%D1%87_%D0%A2%D1%80%D0%BE%D1%86%D0%BA%D0%B8%D0%B9.jpg/330px-%D0%9B%D0%B5%D0%B2_%D0%94%D0%B0%D0%B2%D0%B8%D0%B4%D0%BE%D0%B2%D0%B8%D1%87_%D0%A2%D1%80%D0%BE%D1%86%D0%BA%D0%B8%D0%B9.jpg",
  "Winston Churchill": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Sir_Winston_Churchill_-_19086236948_%28cropped2%29.jpg/330px-Sir_Winston_Churchill_-_19086236948_%28cropped2%29.jpg",
  "Toutânkhamon": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Mask_of_Tutankhamun_2003-12-07.jpg/500px-Mask_of_Tutankhamun_2003-12-07.jpg",
  "Kubilai Khan": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/YuanEmperorAlbumKhubilaiPortrait.jpg/500px-YuanEmperorAlbumKhubilaiPortrait.jpg",
  "Catherine de Médicis": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Catherine_de_M%C3%A9dicis_-_atelier_de_Fran%C3%A7ois_Clouet.jpg/330px-Catherine_de_M%C3%A9dicis_-_atelier_de_Fran%C3%A7ois_Clouet.jpg",
  "Néron": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Et%C3%A0_romana_imperiale%2C_busto_di_nerone%2C_da_olbia%2C_54-59_dc_ca.jpg/500px-Et%C3%A0_romana_imperiale%2C_busto_di_nerone%2C_da_olbia%2C_54-59_dc_ca.jpg"
}

const selected = ref([]);
const wrongCount = ref(0);

watch(
  () => props.gameData,
  () => {
    selected.value = [];
    wrongCount.value = 0;
  },
  { deep: true }
);

const selectPersonnage = (index) => {
  if (selected.value.includes(index)) return;
  selected.value.push(index);

  if (!props.gameData.indices.includes(index)) {
    wrongCount.value++;
    emit("update-jokers", props.jokersRemaining - 1);
    if (wrongCount.value >= 2) emit("game-over", "lose");
  } else {
    emit("found-correct");
  }
};

const getCardClass = (index) => {
  if (!selected.value.includes(index)) return '';
  return props.gameData.indices.includes(index) ? 'correct' : 'wrong';
};
</script>

<style scoped>
.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.game-card {
  width: 160px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 160px; /* Force la même hauteur pour toutes les images */
  object-fit: cover;
  border-radius: 0.5rem;
}

.game-card.correct {
  background-color: #41b88333;
  border: 2px solid #41b883;
}

.game-card.wrong {
  background-color: #f4433633;
  border: 2px solid #f44336;
}

.game-card .p-card-title {
  text-align: center;
  font-weight: 600;
}
</style>
