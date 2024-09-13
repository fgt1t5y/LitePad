import type { EditorTool } from "@/types";
import type { MarkType } from "prosemirror-model";

import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

interface ToolButton {
  [name: string]: HTMLElement;
}

const isActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};

const isHeadingActive = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  return typeof node.attrs.level !== "undefined";
};

class ToolbarView {
  // Etoolbar element
  root: HTMLElement;
  buttons: ToolButton;

  constructor(view: EditorView, toolbar: HTMLElement, tools: EditorTool[]) {
    this.root = toolbar;
    this.buttons = {};

    tools.forEach(({ command, name, icon }) => {
      const btn = document.createElement("button");
      btn.classList.add("i", icon);
      btn.addEventListener("click", () => {
        command(view.state, view.dispatch, view);
        view.focus();
      });
      this.buttons[name] = btn;
      this.root.appendChild(btn);
    });
  }

  update(view: EditorView) {}

  destroy() {
    this.root.remove();
  }
}

export const toolbar = (toolbar: HTMLElement, tools: EditorTool[]): Plugin => {
  return new Plugin({
    view(view) {
      return new ToolbarView(view, toolbar, tools);
    },
  });
};
