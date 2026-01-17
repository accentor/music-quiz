<template>
  <h1>Login to play</h1>
  <form @submit="submit">
    <label for="username">Username</label>
    <input
      v-model="name"
      type="text"
      autocomplete="username"
      autofocus="autofocus"
      name="username"
      required="required"
    />

    <label for="password">Password</label>
    <input
      v-model="password"
      type="password"
      autocomplete="current-password"
      name="password"
      required="required"
    />

    <button type="submit">Login</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";

export default {
  name: "Login",
  setup() {
    const name = ref(null);
    const password = ref(null);
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    async function submit(e) {
      e.preventDefault();
      const succeeded = await authStore.login({
        name: name.value,
        password: password.value,
      });
      if (succeeded) {
        const path = route.query.redirect || "/";
        router.push({ path });
      }
    }

    return { name, password, submit };
  },
};
</script>
