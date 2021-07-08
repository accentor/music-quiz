<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <h2 class="loader">{{ messages[currentMessage] }}</h2>
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from "vue";

export default {
  setup() {
    const messages = [
      "Loading all the tracks ...",
      "Mic check... Mic check ...",
      "Tuning the guitars ...",
      "Is this thing on?",
    ];
    const currentMessage = ref(0);

    function nextMessage() {
      currentMessage.value = Math.floor(Math.random() * messages.length);
    }

    const intervalHandle = setInterval(nextMessage, 3000);
    onBeforeUnmount(() => clearInterval(intervalHandle.value));

    return { currentMessage, messages };
  },
};
</script>

<style>
.loader {
  @apply text-secundary text-3xl font-bold -rotate-3;
}

.loader::after {
  content: "";
  @apply h-4 bottom-2 left-0 bg-primary block;
  animation-name: loader;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-delay: 0s;
  animation-timing-function: linear;
}

@keyframes loader {
  0% {
    width: 0%;
  }
  99% {
    width: 100%;
  }
}
</style>
