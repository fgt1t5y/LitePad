import type { Command } from "prosemirror-state";
import type { EditorTool } from "@/types";

import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { schema } from "./schema";

const heading = (level: number) => {
  return {
    command: setBlockType(schema.nodes.heading, { level }),
    name: `h${level}`,
  };
};

const insertImage = (src: string): Command => {
  return (state, dispatch) => {
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

export const tools = [
  { command: undo, name: "undo", key: "Mod-z" },
  { command: redo, name: "redo", key: "Mod-y" },
  { command: toggleMark(schema.marks.bold), name: "bold", key: "Mod-b" },
  { command: toggleMark(schema.marks.italic), name: "italic", key: "Mod-i" },
  { command: toggleMark(schema.marks.del), name: "del" },
  { command: toggleMark(schema.marks.code), name: "code", key: "Mod-`" },
  {
    command: insertImage(
      "https://picx.zhimg.com/80/v2-a3e754cb7b23a9daa569e211652dd2fa_720w.jpeg"
    ),
    name: "image",
  },
  {
    command: insertHorizontalRule(),
    name: "hr",
  },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
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

    tools.forEach(({ command, name }) => {
      const btn = document.createElement("button");
      btn.innerText = name;
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
