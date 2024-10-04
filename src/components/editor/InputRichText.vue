<template>
  <div ref="targetRef"></div>
</template>

<script setup lang="ts">
import { EditorView } from "prosemirror-view";
import { EditorState, Transaction } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { dropCursor } from "prosemirror-dropcursor";
import { schema } from "@/components/editor/schema";
import { placeholder } from "./placeholder";
import { extraKeymap } from "./tools";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { getHTMLFromFragment, createNodeFromContent } from "./helper";
import { dragHandle } from "./draghandle";

defineOptions({
  name: "InputRichText",
});

const targetRef = ref<HTMLElement>();

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

  if (tr.docChanged) syncHTML();
};

watch(
  () => html.value,
  (newHTML, lastHTML) => {
    if (newHTML === lastHTML || !view) return;

    const { tr, doc } = view.state;

    const node = createNodeFromContent(newHTML, schema);

    view.dispatch(tr.replaceWith(0, doc.content.size, node));
  },
  { once: true }
);

onMounted(() => {
  if (!targetRef.value) return;

  view = new EditorView(
    { mount: targetRef.value },
    {
      state: EditorState.create({
        schema,
        plugins: [
          keymap(baseKeymap),
          history(),
          keymap(extraKeymap),
          dropCursor(),
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
});

onUnmounted(() => {
  if (view) view.destroy();
  view = null;
});
</script>
