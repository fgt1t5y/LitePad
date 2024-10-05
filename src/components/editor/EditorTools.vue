<template>
  <div class="EditorTools">
    <button
      v-for="tool in list"
      :class="{ Tool: true, ToolActive: tool.active() }"
      :disabled="!tool.enable()"
      @click="tool.command"
    >
      <i :class="tool.icon"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { LitePadEditor } from ".";

defineOptions({
  name: "EditorTools",
});

const props = defineProps<{
  editor: LitePadEditor;
}>();

interface Tool {
  icon: string;
  command: () => void;
  active: () => boolean;
  enable: () => boolean;
}

const heading = (level: number): Tool => ({
  icon: `i i-m i-h${level}`,
  command: () => props.editor.setNode("heading", { level }),
  active: () => props.editor.isNodeActive("heading", { level }),
  enable: () => true,
});

const list = [
  {
    icon: "i i-m i-undo",
    command: () => props.editor.undo(),
    active: () => false,
    enable: () => props.editor.canUndo(),
  },
  {
    icon: "i i-m i-redo",
    command: () => props.editor.redo(),
    active: () => false,
    enable: () => props.editor.canRedo(),
  },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  {
    icon: "i i-m i-paragraph",
    command: () => props.editor.setNode("paragraph"),
    active: () => props.editor.isNodeActive("paragraph"),
    enable: () => true,
  },
  {
    icon: "i i-m i-quote",
    command: () => props.editor.setNode("blockquote"),
    active: () => props.editor.isNodeActive("blockquote"),
    enable: () => true,
  },
  {
    icon: "i i-m i-bold",
    command: () => props.editor.toggleMark("bold"),
    active: () => props.editor.isMarkActive("bold"),
    enable: () => true,
  },
  {
    icon: "i i-m i-italic",
    command: () => props.editor.toggleMark("italic"),
    active: () => props.editor.isMarkActive("italic"),
    enable: () => true,
  },
  {
    icon: "i i-m i-strikethrough",
    command: () => props.editor.toggleMark("del"),
    active: () => props.editor.isMarkActive("del"),
    enable: () => true,
  },
  {
    icon: "i i-m i-code",
    command: () => props.editor.toggleMark("code"),
    active: () => props.editor.isMarkActive("code"),
    enable: () => true,
  },
] as Tool[];
</script>
