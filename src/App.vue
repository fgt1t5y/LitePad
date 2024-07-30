<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./services/theme";

const theme = useTheme();
theme.init();
</script>
