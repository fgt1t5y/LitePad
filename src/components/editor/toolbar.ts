import type { MarkType } from "prosemirror-model";
import type { EditorTools, ToolbarButtons } from "@/types";

import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { redo, undo } from "prosemirror-history";
import { schema } from "./schema";

const setDisabled = (el: HTMLElement, on: boolean) => {
  if (on) {
    el.setAttribute("disabled", "");
  } else {
    el.removeAttribute("disabled");
  }
};

const setActive = (el: HTMLElement, on: boolean) => {
  if (on) {
    el.classList.add("ToolActive");
  } else {
    el.classList.remove("ToolActive");
  }
};

const isActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};

const isMarkActive = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  return node.hasMarkup(schema.nodes.paragraph);
};

const getActiveNode = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  if (node.attrs.level) {
    return `h${node.attrs.level}`;
  }

  return node.type.name;
};

class ToolbarView {
  // toolbar element
  root: HTMLElement;
  buttons: ToolbarButtons;
  tools: EditorTools;

  currentActiveNode: string | null;

  constructor(view: EditorView, toolbar: HTMLElement, tools: EditorTools) {
    this.root = toolbar;
    this.buttons = {
      history: {},
      node: {},
      mark: {},
    };
    this.tools = tools;
    this.currentActiveNode = null;

    this.root.appendChild(this.buildDOM(view, "node"));
    this.root.appendChild(this.buildDOM(view, "mark"));
    this.root.appendChild(this.buildDOM(view, "history"));

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

    if (this.currentActiveNode) {
      setActive(this.buttons.node[this.currentActiveNode], false);
    }

    const activeNode = getActiveNode(view);
    setActive(this.buttons.node[activeNode], true);
    this.currentActiveNode = activeNode;

    if (isMarkActive(view)) {
      this.tools.mark.forEach((tool) => {
        setActive(
          this.buttons.mark[tool.name],
          isActive(view.state, schema.marks[tool.name])
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
