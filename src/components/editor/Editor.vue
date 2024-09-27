<template>
  <div class="Toolbar" ref="toolbarRef"></div>
  <div class="BubbleMenu" ref="bubbleMenuRef"></div>
  <div class="EditArea">
    <input class="TitleInput" type="text" placeholder="无标题笔记" />
    <div class="ContentInput" ref="editorBodyRef"></div>
  </div>
</template>

<script setup lang="ts">
import { EditorView } from "prosemirror-view";
import { EditorState, Transaction } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { schema } from "@/components/editor/schema";
import { toolbar } from "./toolbar";
import { placeholder } from "./placeholder";
import { tools, extraKeymap } from "./tools";
import { onMounted, ref } from "vue";
import { useXScroll } from "@/utils/useXScroll";
import { bubbleMenu } from "./bubblemenu";
import { getHTMLFromFragment, createNodeFromContent } from "./helper";

const toolbarRef = ref<HTMLElement>();
const bubbleMenuRef = ref<HTMLElement>();
const editorBodyRef = ref<HTMLElement>();

const html = defineModel("html", {
  default: "<p></p>",
});

let view: EditorView | null = null;

const dispatchTransaction = (tr: Transaction) => {
  if (!view || view.isDestroyed || !view.editable) return;

  const state = view.state.apply(tr);
  view.updateState(state);

  html.value = getHTMLFromFragment(view.state.doc.content, schema);
};

const destroy = () => {
  if (view) view.destroy();
};

onMounted(() => {
  view = new EditorView(
    { mount: editorBodyRef.value! },
    {
      state: EditorState.create({
        schema,
        plugins: [
          keymap(baseKeymap),
          history(),
          keymap(extraKeymap),
          toolbar({
            target: toolbarRef.value!,
            tools,
          }),
          bubbleMenu({
            target: bubbleMenuRef.value!,
            tools: tools.textFormat,
          }),
          placeholder(),
        ],
        doc: createNodeFromContent(html.value, schema),
      }),
      dispatchTransaction(tr) {
        dispatchTransaction(tr);
      },
    }
  );
  html.value = getHTMLFromFragment(view.state.doc.content, schema);

  useXScroll(toolbarRef.value!);
});

defineExpose({ destroy });
</script>
