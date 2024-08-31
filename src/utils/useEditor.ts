import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { schema } from "@/lib/schema";

export const useEditor = (el: HTMLElement) => {
  if (!el) return;

  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap({
        "Mod-z": undo,
        "Mod-y": redo,
      }),
    ],
  });

  const view = new EditorView(el, {
    state,
  });

  return;
};
