<template>
  <div class="w-screen min-h-screen flex flex-col justify-between">
    <div>
      <div
        :style="{ width: `${currentQuestion * 10}vw` }"
        class="bg-primary h-4"
        aria-hidden="true"
      ></div>
      <span v-if="currentQuestion < 11" class="text-right w-full block px-4">
        <span class="font-bold">{{ currentQuestion }}</span> / 10
      </span>
    </div>
    <Question
      v-if="currentQuestion < 11"
      :key="currentQuestion"
      :used-tracks="usedTracks"
      :difficulty="difficulty"
      @answered="handleAnswer"
    />
    <div>
      <h3 class="text-primary font-medium text-4xl text-center uppercase">
        Total score: {{ totalScore }}
      </h3>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Question from "../../components/Question.vue";

export default {
  name: "Game",
  components: {
    Question,
  },
  props: {
    difficulty: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

    const usedTracks = ref([]);
    const totalScore = ref(0);
    const currentQuestion = ref(1);

    function handleAnswer(answ) {
      usedTracks.value.push(...answ.usedTracks);
      totalScore.value += answ.score;
      setTimeout(() => {
        currentQuestion.value++;
      }, 2500);
    }

    watch(currentQuestion, (newValue) => {
      if (newValue > 10) {
        store.commit("games/addGame", {
          usedTracks: usedTracks.value,
          totalScore: totalScore.value,
          difficulty: props.difficulty,
        });
        setTimeout(() => router.push({ path: "/app/game/new" }), 5000);
      }
    });

    function resetGame() {
      usedTracks.value = [];
      totalScore.value = 0;
      currentQuestion.value = 1;
    }

    const highScore = computed(() => store.getters["games/highScore"]);

    return {
      ...props,
      handleAnswer,
      usedTracks,
      totalScore,
      currentQuestion,
      resetGame,
      highScore,
    };
  },
};
</script>

<style></style>
