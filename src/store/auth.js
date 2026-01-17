import { defineStore } from "pinia";
import { computed } from "vue";
import AccentorApi from "../api";
import { useErrorsStore } from "./errors";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const errorsStore = useErrorsStore();

  const apiToken = useLocalStorage("auth.apiToken", null, {
    serializer: StorageSerializers.object,
  });
  const userId = useLocalStorage("auth.userId", null, {
    serializer: StorageSerializers.object,
  });
  const id = useLocalStorage("auth.id", null, {
    serializer: StorageSerializers.object,
  });
  const loggedIn = computed(() => apiToken.value !== null);
  const currentSession = computed(() => id.value);

  async function login(data) {
    try {
      const result = await AccentorApi.authTokens.create(data);
      apiToken.value = result.token;
      userId.value = result.user_id;
      id.value = result.id;
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function logout() {
    try {
      await AccentorApi.authTokens.destroy(apiToken.value, id.value);
      apiToken.value = null;
      userId.value = null;
      id.value = null;
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  return {
    apiToken,
    userId,
    id,
    loggedIn,
    currentSession,
    login,
    logout,
  };
});
