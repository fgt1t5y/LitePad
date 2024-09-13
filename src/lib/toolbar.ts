import type { Command, EditorState } from "prosemirror-state";
import type { MarkType } from "prosemirror-model";
import type { EditorTool } from "@/types";

import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { schema } from "./schema";

const isActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};

const isHeadingActive = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  return typeof node.attrs.level !== "undefined";
};

const heading = (level: number): EditorTool => {
  return {
    command: setBlockType(schema.nodes.heading, { level }),
    name: `h${level}`,
    key: `Mod-${level}`,
    icon: `format_h${level}`,
  };
};

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

export const tools = [
  { command: undo, name: "undo", key: "Mod-z", icon: "undo" },
  { command: redo, name: "redo", key: "Mod-y", icon: "redo" },
  {
    command: toggleMark(schema.marks.bold),
    name: "bold",
    key: "Mod-b",
    icon: "format_bold",
  },
  {
    command: toggleMark(schema.marks.italic),
    name: "italic",
    key: "Mod-i",
    icon: "format_italic",
  },
  {
    command: toggleMark(schema.marks.del),
    name: "del",
    icon: "strikethrough_s",
  },
  {
    command: toggleMark(schema.marks.code),
    name: "code",
    key: "Mod-`",
    icon: "code",
  },
  { command: insertImage(), name: "image", icon: "image" },
  { command: insertLink(), name: "link", key: "Mod-k", icon: "link" },
  { command: insertHorizontalRule(), name: "hr", icon: "horizontal_rule " },
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
    icon: "format_paragraph",
  },
] as EditorTool[];

interface ToolButton {
  [name: string]: HTMLElement;
}

class ToolbarView {
  // Etoolbar element
  root: HTMLElement;
  buttons: ToolButton;

  constructor(view: EditorView, toolbar: HTMLElement) {
    this.root = toolbar;
    this.buttons = {};

    tools.forEach(({ command, name, icon }) => {
      const btn = document.createElement("button");
      btn.classList.add("Icon");
      btn.innerText = icon;
      btn.addEventListener("click", () => {
        command(view.state, view.dispatch, view);
        view.focus();
      });
      this.buttons[name] = btn;
      this.root.appendChild(btn);
    });
  }

  update(view: EditorView) {}

  destory() {
    this.root.remove();
  }
}

export const toolbar = (toolbar: HTMLElement): Plugin => {
  return new Plugin({
    view(view) {
      return new ToolbarView(view, toolbar);
    },
  });
};
