<template>
  <RouterView />
  <Toast />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./utils/useTheme";
import { useShared } from "./utils/useShared";

useTheme().init();
useShared().init();
</script>
