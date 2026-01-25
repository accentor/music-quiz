<template>
  <div class="h-screen flex flex-col items-center justify-center space-y-20">
    <div class="space-y-6 text-center">
      <h1 class="uppercase font-bold text-3xl -rotate-2 text-secondary">
        The accentor Music Quiz!
      </h1>
      <p class="text-lg text-gray-800 font-medium">
        How well do you know your music collection?
      </p>
    </div>
    <div class="space-y-2 flex flex-col justify-center">
      <div class="flex w-full justify-between button-group">
        <input
          id="game_difficulty_hard"
          v-model="difficulty"
          type="radio"
          name="difficulty"
          value="hard"
          class="button-group__input"
        />
        <label for="game_difficulty_hard" class="button-group__button">
          Hard
          <span class="button-group__info">All tracks</span>
        </label>
        <input
          id="game_difficulty_medium"
          v-model="difficulty"
          :disabled="!enoughPlays"
          type="radio"
          name="difficulty[m"
          value="medium"
          class="button-group__input"
        />
        <label for="game_difficulty_medium" class="button-group__button">
          Medium
          <span class="button-group__info">
            {{ enoughPlays ? "Tracks you've played" : "Not available yet" }}
          </span>
        </label>
        <input
          id="game_difficulty_easy"
          v-model="difficulty"
          :disabled="!enoughPlays"
          type="radio"
          name="difficulty"
          value="easy"
          class="button-group__input"
        />
        <label for="game_difficulty_easy" class="button-group__button">
          Easy
          <span class="button-group__info">
            {{
              enoughPlays
                ? "Tracks you've played weighted by play count"
                : "Not available yet"
            }}
          </span>
        </label>
      </div>
      <button
        class="-mx-4 text-white text-xl bg-primary uppercase font-medium px-10 py-6 rounded-lg hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-4 focus:ring-offset-white"
        @click="startGame"
      >
        Start new game!
      </button>
    </div>
    <div>
      <h2 class="text-3xl text-primary font-bold">Leaderboard</h2>
      <ol class="space-y-4 text-2xl text-primary font-bold text-center">
        <li
          v-for="(game, i) in leaderBoard"
          :key="i"
          class="list-inside list-decimal"
        >
          {{ game.totalScore }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useGamesStore } from "../../store/games";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "NewGame",
  setup() {
    const router = useRouter();
    const gamesStore = useGamesStore();
    const tracksStore = useTracksStore();
    const difficulty = ref("medium");
    const leaderBoard = computed(() =>
      gamesStore.leaderBoard
        .filter((g) => g.difficulty === difficulty.value)
        .slice(0, 10),
    );

    function startGame() {
      router.push(`/app/game/play/${difficulty.value}`);
    }

    const enoughPlays = computed(
      () => Object.keys(tracksStore.tracksPlayedOnce).length > 100,
    );

    return {
      difficulty,
      enoughPlays,
      leaderBoard,
      startGame,
    };
  },
};
</script>

<style lang="css">
@reference "../../styles.css";

.button-group__input {
  display: none;
}

.button-group__button {
  @apply w-full border-primary border-2 text-center border-r-0;
  @apply uppercase font-medium text-base text-secondary p-3;
}

.button-group__input:disabled + .button-group__button {
  @apply text-gray-600;
}

.button-group__button:first-of-type {
  @apply rounded-l-lg;
}

.button-group__button:last-of-type {
  @apply rounded-r-lg border-r-2;
}

.button-group__input:checked + .button-group__button {
  @apply bg-primary text-white;
}

.button-group__info {
  @apply text-xs lowercase text-primary block;
}

.button-group__input:checked + .button-group__button > .button-group__info {
  @apply text-gray-50;
}

.button-group__input:disabled + .button-group__button > .button-group__info {
  @apply text-gray-400;
}
</style>
