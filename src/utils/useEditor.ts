import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { schema } from "@/lib/schema";
import { toolbar } from "@/lib/toolbar";

export const useEditor = (root: HTMLElement): EditorView | null => {
  if (!root) return null;

  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap({
        "Mod-z": undo,
        "Mod-y": redo,
      }),
      toolbar(root),
    ],
  });

  const view = new EditorView(root, { state });

  return view;
};
