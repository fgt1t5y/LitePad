import type { Command } from "prosemirror-state";
import type { EditorTool } from "@/types";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, setBlockType, toggleMark } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { schema } from "@/lib/schema";
import { toolbar } from "@/lib/toolbar";
import { placeholder } from "@/lib/placeholder";

const insertImage = (): Command => {
  return (state, dispatch) => {
    const src = prompt("Image URL: ");
    if (!src) return false;

    const node = schema.nodes.image.createAndFill({ src });
    if (!node) return false;

    const tr = state.tr.replaceSelectionWith(node);

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  };
};

const insertHorizontalRule = (): Command => {
  return (state, dispatch) => {
    const tr = state.tr.replaceSelectionWith(schema.nodes.hr.create());

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  };
};

const insertLink = (): Command => {
  return (state, dispatch) => {
    if (state.selection.empty) {
      console.log(state.selection);
      return false;
    }

    const url = prompt("URL: ");

    if (!url) return false;

    return toggleMark(schema.marks.link, { href: url })(state, dispatch);
  };
};

const heading = (level: number): EditorTool => {
  return {
    command: setBlockType(schema.nodes.heading, { level }),
    name: `h${level}`,
    key: `Mod-${level}`,
    icon: `i-h${level}`,
  };
};

export const tools = [
  { command: undo, name: "undo", key: "Mod-z", icon: "i-undo" },
  { command: redo, name: "redo", key: "Mod-y", icon: "i-redo" },
  {
    command: toggleMark(schema.marks.bold),
    name: "bold",
    key: "Mod-b",
    icon: "i-bold",
  },
  {
    command: toggleMark(schema.marks.italic),
    name: "italic",
    key: "Mod-i",
    icon: "i-italic",
  },
  {
    command: toggleMark(schema.marks.del),
    name: "del",
    icon: "i-strikethrough",
  },
  {
    command: toggleMark(schema.marks.code),
    name: "code",
    key: "Mod-`",
    icon: "i-code",
  },
  { command: insertImage(), name: "image", icon: "i-image" },
  { command: insertLink(), name: "link", key: "Mod-k", icon: "i-link" },
  { command: insertHorizontalRule(), name: "hr", icon: "i-horizontal-rule" },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  {
    command: setBlockType(schema.nodes.paragraph),
    name: "正文",
    key: "Mod-0",
    icon: "i-paragraph",
  },
] as EditorTool[];

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
      toolbar(toolbarEl, tools),
      placeholder(),
    ],
  });

  const view = new EditorView(body, { state });

  return view;
};
