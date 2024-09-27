import type { EditorTools, ToolbarButtons } from "@/types";

import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { redo, undo } from "prosemirror-history";
import { schema } from "./schema";
import { isMarkActive, hasMarkActive, setDisabled, setActive } from "./helper";

const getActiveNodeName = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  if (node.type.name === "heading") {
    return `h${node.attrs.level}`;
  }

  return node.type.name;
};

class ToolbarView {
  // toolbar element
  root: HTMLElement;
  buttons: ToolbarButtons;
  tools: EditorTools;

  lastActiveLineFormat: string | null;

  constructor(view: EditorView, toolbar: HTMLElement, tools: EditorTools) {
    this.root = toolbar;
    this.buttons = {
      history: {},
      lineFormat: {},
      textFormat: {},
      node: {},
    };
    this.tools = tools;
    this.lastActiveLineFormat = null;

    this.root.appendChild(this.buildDOM(view, "history"));
    this.root.appendChild(this.buildDOM(view, "lineFormat"));
    this.root.appendChild(this.buildDOM(view, "textFormat"));
    this.root.appendChild(this.buildDOM(view, "node"));

    this.update(view);
  }

  private buildDOM(view: EditorView, type: keyof EditorTools) {
    const tools = this.tools[type];
    const wrapper = document.createElement("div");
    wrapper.classList.add("ToolGroup");
    tools.forEach(({ command, name, icon }) => {
      const btn = document.createElement("button");
      btn.classList.add("i", "i-m", icon);
      btn.addEventListener("click", () => {
        command(view.state, view.dispatch, view);
        view.focus();
      });
      this.buttons[type][name] = btn;
      wrapper.appendChild(btn);
    });

    return wrapper;
  }

  update(view: EditorView) {
    const canUndo = undo(view.state);
    const canRedo = redo(view.state);

    setDisabled(this.buttons.history.undo, !canUndo);
    setDisabled(this.buttons.history.redo, !canRedo);

    if (this.lastActiveLineFormat) {
      setActive(this.buttons.lineFormat[this.lastActiveLineFormat], false);
    }

    const activeNode = getActiveNodeName(view);
    setActive(this.buttons.lineFormat[activeNode], true);
    this.lastActiveLineFormat = activeNode;

    if (hasMarkActive(view)) {
      this.tools.textFormat.forEach((tool) => {
        setActive(
          this.buttons.textFormat[tool.name],
          isMarkActive(view.state, schema.marks[tool.name])
        );
      });
    }
  }

  destroy() {
    this.root.remove();
  }
}

interface ToolbarOptions {
  target: HTMLElement;
  tools: EditorTools;
}

export const toolbar = (options: ToolbarOptions): Plugin => {
  return new Plugin({
    view(view) {
      const { target, tools } = options;
      return new ToolbarView(view, target, tools);
    },
  });
};
