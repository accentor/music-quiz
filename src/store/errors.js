import { ref } from "vue";
import { defineStore } from "pinia";

export const useErrorsStore = defineStore("errors", () => {
  const errors = ref([]);

  function addError(error) {
    errors.value.push(error);
  }

  return { errors, addError };
});
