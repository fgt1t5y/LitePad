<template>
  <div id="WelcomeView">
    <div class="Wrapper">
      <h1>LitePad</h1>
      <Button @click="s.bus.createNote.emit()">新建笔记</Button>
      <Button @click="s.modal.createNotebook = true" text> 新建笔记本 </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShared } from "@/utils/useShared";

const s = useShared();
</script>
