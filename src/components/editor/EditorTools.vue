<template>
  <div class="EditorTools">
    <button
      v-for="tool in tools"
      :class="{ Tool: true, ToolActive: tool.active() }"
      :disabled="!tool.enable()"
      @click="tool.command"
    >
      <i :class="tool.icon"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { EditorTool } from "@/types";

defineOptions({
  name: "EditorTools",
});

const props = defineProps<{
  tools: EditorTool[];
}>();
</script>
