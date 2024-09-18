<template>
  <div class="Toolbar" ref="toolbarRef"></div>
  <div class="EditArea">
    <input class="TitleInput" type="text" placeholder="无标题笔记" />
    <div class="EditorBody" ref="editorBodyRef"></div>
  </div>
</template>

<script setup lang="ts">
import type { Command } from "prosemirror-state";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { schema } from "@/components/editor/schema";
import { toolbar } from "@/components/editor/toolbar";
import { placeholder } from "@/components/editor/placeholder";
import { tools } from "@/components/editor/tools";
import { onMounted, ref } from "vue";
import { useXScroll } from "@/utils/useXScroll";

const toolbarRef = ref<HTMLElement>();
const editorBodyRef = ref<HTMLElement>();

let view: EditorView | null = null;

interface Keymap {
  [key: string]: Command;
}

const buildKeymap = () => {
  const keymap = {} as Keymap;

  tools.forEach((tool) => {
    if (tool.key) {
      keymap[tool.key] = tool.command;
    }
  });

  return keymap;
};

const destroy = () => {
  if (view) view.destroy();
};

onMounted(() => {
  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap(buildKeymap()),
      toolbar(toolbarRef.value!, tools),
      placeholder(),
    ],
  });

  view = new EditorView(editorBodyRef.value!, { state });

  useXScroll(toolbarRef.value!)
});

defineExpose({ destroy });
</script>
