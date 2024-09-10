import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { schema } from "@/lib/schema";
import { toolbar } from "@/lib/toolbar";

export const useEditor = (el: HTMLElement): EditorView | null => {
  if (!el) return null;

  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap({
        "Mod-z": undo,
        "Mod-y": redo,
      }),
      toolbar(el),
    ],
  });

  const view = new EditorView(el, { state });

  return view;
};
