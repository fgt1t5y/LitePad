import type { EditorTool, EditorTools } from "@/types";
import type { Command } from "prosemirror-state";
import type { Keymap } from "@/types";

import { setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { schema } from "@/components/editor/schema";

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
    type: "lineFormat",
  };
};

export const toolsRaw = [
  {
    command: undo,
    name: "undo",
    key: "Mod-z",
    icon: "i-undo",
    type: "history",
  },
  {
    command: redo,
    name: "redo",
    key: "Mod-y",
    icon: "i-redo",
    type: "history",
  },
  {
    command: toggleMark(schema.marks.bold),
    name: "bold",
    key: "Mod-b",
    icon: "i-bold",
    type: "textFormat",
  },
  {
    command: toggleMark(schema.marks.italic),
    name: "italic",
    key: "Mod-i",
    icon: "i-italic",
    type: "textFormat",
  },
  {
    command: toggleMark(schema.marks.del),
    name: "del",
    icon: "i-strikethrough",
    type: "textFormat",
  },
  {
    command: toggleMark(schema.marks.code),
    name: "code",
    key: "Mod-`",
    icon: "i-code",
    type: "textFormat",
  },
  {
    command: insertLink(),
    name: "link",
    key: "Mod-k",
    icon: "i-link",
    type: "textFormat",
  },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  {
    command: setBlockType(schema.nodes.paragraph),
    name: "paragraph",
    key: "Mod-0",
    icon: "i-paragraph",
    type: "lineFormat",
  },
  {
    command: wrapIn(schema.nodes.blockquote),
    name: "blockquote",
    key: "Mod-q",
    icon: "i-quote",
    type: "node",
  },
  { command: insertImage(), name: "image", icon: "i-image", type: "node" },
  {
    command: insertHorizontalRule(),
    name: "hr",
    icon: "i-horizontal-rule",
    type: "node",
  },
] as EditorTool[];

export const tools = Object.groupBy(
  toolsRaw,
  ({ type }) => type
) as EditorTools;

const buildKeymap = () => {
  const keymap = {} as Keymap;

  toolsRaw.forEach((tool) => {
    if (tool.key) {
      keymap[tool.key] = tool.command;
    }
  });

  return keymap;
};

export const extraKeymap = buildKeymap();
