export default {
  namespaced: true,
  state: {
    games: [],
  },
  mutations: {
    addGame(state, payload) {
      payload.finished = new Date();
      state.games.push(payload);
    },
  },
  getters: {
    leaderBoard: (state) =>
      state.games
        .filter((g1) => g1.totalScore > 0)
        .sort((g1, g2) => g2.totalScore - g1.totalScore),
    highScore: (state, getters) => getters.leaderBoard[0]?.totalScore,
  },
};
