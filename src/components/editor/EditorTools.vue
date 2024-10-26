<template>
  <div class="EditorTools">
    <div class="Group">
      <button
        v-for="tool in tools.headerExtra"
        :class="{ Tool: true, ToolActive: tool.active() }"
        :disabled="!tool.enable()"
        @click="tool.command"
      >
        <i :class="tool.icon"></i>
      </button>
    </div>
    <div v-if="editable" class="Group">
      <button
        v-for="tool in tools.action"
        :class="{ Tool: true, ToolActive: tool.active() }"
        :disabled="!tool.enable()"
        @click="tool.command"
      >
        <i :class="tool.icon"></i>
      </button>
    </div>
    <div v-if="editable" class="Group">
      <button
        v-for="tool in tools.node"
        :class="{ Tool: true, ToolActive: tool.active() }"
        :disabled="!tool.enable()"
        @click="tool.command"
      >
        <i :class="tool.icon"></i>
      </button>
    </div>
    <div v-if="editable" class="Group">
      <button
        v-for="tool in tools.mark"
        :class="{ Tool: true, ToolActive: tool.active() }"
        :disabled="!tool.enable()"
        @click="tool.command"
      >
        <i :class="tool.icon"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EditorToolSet } from "@/types";

defineOptions({
  name: "EditorTools",
});

const props = defineProps<{
  tools: EditorToolSet;
  editable?: boolean;
}>();
</script>
