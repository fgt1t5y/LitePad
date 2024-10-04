<template>
  <div class="Toolbar" ref="toolbarRef"></div>
  <div class="BubbleMenu" ref="bubbleMenuRef"></div>
  <div class="EditArea">
    <slot />
    <div class="ContentInput" ref="editorBodyRef"></div>
  </div>
</template>

<script setup lang="ts">
import { EditorView } from "prosemirror-view";
import { EditorState, Transaction } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { dropCursor } from "prosemirror-dropcursor";
import { schema } from "@/components/editor/schema";
import { toolbar } from "./toolbar";
import { placeholder } from "./placeholder";
import { tools, extraKeymap } from "./tools";
import { onMounted, onUnmounted, ref } from "vue";
import { useXScroll } from "@/utils/useXScroll";
import { bubbleMenu } from "./bubblemenu";
import { getHTMLFromFragment, createNodeFromContent } from "./helper";
import { dragHandle } from "./draghandle";

const toolbarRef = ref<HTMLElement>();
const bubbleMenuRef = ref<HTMLElement>();
const editorBodyRef = ref<HTMLElement>();

const html = defineModel("html", {
  default: "<p></p>",
});

let view: EditorView | null = null;

const syncHTML = () => {
  if (!view) return;
  html.value = getHTMLFromFragment(view.state.doc.content, schema);
};

const dispatchTransaction = (tr: Transaction) => {
  if (!view || view.isDestroyed || !view.editable) return;

  const state = view.state.apply(tr);
  view.updateState(state);

  syncHTML();
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
          dropCursor({
            color: "var(--p-primary-color)",
            width: 2,
          }),
          toolbar({
            target: toolbarRef.value!,
            tools,
          }),
          bubbleMenu({
            target: bubbleMenuRef.value!,
            tools: tools.textFormat,
          }),
          placeholder(),
          dragHandle({
            dragHandleWidth: 30,
            scrollTreshold: 10,
            excludedTags: ["hr"],
          }),
        ],
        doc: createNodeFromContent(html.value, schema),
      }),
      dispatchTransaction(tr) {
        dispatchTransaction(tr);
      },
    }
  );

  syncHTML();

  useXScroll(toolbarRef.value!);
});

onUnmounted(() => {
  if (view) view.destroy();
  view = null;
});

defineExpose({ destroy });
</script>
