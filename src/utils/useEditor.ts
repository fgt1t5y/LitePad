import type { Command } from "prosemirror-state";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { schema } from "@/lib/schema";
import { toolbar, tools } from "@/lib/toolbar";
import { placeholder } from "@/lib/placeholder";

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

export const useEditor = (
  toolbarEl: HTMLElement,
  body: HTMLElement
): EditorView | null => {
  if (!toolbarEl || !body) return null;

  const state = EditorState.create({
    schema,
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap(buildKeymap()),
      toolbar(toolbarEl),
      placeholder(),
    ],
  });

  const view = new EditorView(body, { state });

  return view;
};
