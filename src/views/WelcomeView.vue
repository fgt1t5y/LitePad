<template>
  <div id="WelcomeView">
    <div class="Wrapper">
      <h1>LitePad</h1>
      <Button>新建笔记</Button>
      <Button text @click="d.modalVisible.createNotebook = true">
        新建笔记本
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShared } from "@/utils/useShared";

const d = useShared();
</script>
