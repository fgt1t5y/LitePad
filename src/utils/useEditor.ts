import type { Command } from "prosemirror-state";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { schema } from "@/lib/schema";
import { toolbar, tools } from "@/lib/toolbar";

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

export const useEditor = (root: HTMLElement): EditorView | null => {
  if (!root) return null;

  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap(buildKeymap()),
      toolbar(root),
    ],
  });

  const view = new EditorView(root, { state });

  return view;
};
