<template>
  <div class="Toolbar" ref="toolbarRef"></div>
  <div class="EditArea">
    <input class="TitleInput" type="text" placeholder="无标题笔记" />
    <div class="ContentInput" ref="editorBodyRef"></div>
  </div>
</template>

<script setup lang="ts">
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { schema } from "@/components/editor/schema";
import { toolbar } from "./toolbar";
import { placeholder } from "./placeholder";
import { tools, extraKeymap } from "@/components/editor/tools";
import { onMounted, ref } from "vue";
import { useXScroll } from "@/utils/useXScroll";

const toolbarRef = ref<HTMLElement>();
const editorBodyRef = ref<HTMLElement>();

let view: EditorView | null = null;

const destroy = () => {
  if (view) view.destroy();
};

onMounted(() => {
  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap(extraKeymap),
      toolbar({
        target: toolbarRef.value!,
        tools,
      }),
      placeholder(),
    ],
  });

  view = new EditorView({ mount: editorBodyRef.value! }, { state });

  useXScroll(toolbarRef.value!);
});

defineExpose({ destroy });
</script>
