import { defineStore } from "pinia";
import { computed } from "vue";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export const useGamesStore = defineStore("games", () => {
  const games = useLocalStorage("games.games", [], {
    serializer: StorageSerializers.object,
  });

  function addGame(payload) {
    payload.finished = new Date();
    games.value.push(payload);
  }

  const leaderBoard = computed(() =>
    games.value
      .filter((g1) => g1.totalScore > 0)
      .sort((g1, g2) => g2.totalScore - g1.totalScore)
  );

  const highScore = computed(() => leaderBoard.value[0]?.totalScore);

  return {
    games,
    addGame,
    leaderBoard,
    highScore,
  };
});
