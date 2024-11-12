<template>
  <RouterView />
  <Toast />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./utils/useTheme";
import { useToast } from "primevue/usetoast";
import router from "./router";

useTheme().init();
const toast = useToast();

router.replace({ name: "main" });

const errorToast = (message: string) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: message,
  });
};

// 在 Promise 被 reject 时触发
// 弹出 toast 并打印 log
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    if (typeof event.reason === "string") {
      errorToast(event.reason);
      console.log(event.reason);
    } else {
      errorToast(event.reason.message);
      console.log(event.reason.message);
    }
  }
);
</script>
