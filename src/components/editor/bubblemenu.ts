import type { PluginView } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { EditorTool, ToolBarButton } from "@/types";

import { Plugin } from "prosemirror-state";
import debounce from "debounce";
import { schema } from "./schema";
import { isMarkActive, hasMarkActive, setActive } from "./helper";

class BubbleMenuView implements PluginView {
  root: HTMLElement;
  buttons: ToolBarButton;
  tools: EditorTool[];
  alignElement: (view: EditorView) => void;

  constructor(view: EditorView, target: HTMLElement, tools: EditorTool[]) {
    this.root = target;
    this.buttons = {};
    this.tools = tools;
    this.alignElement = debounce(this._alignElement, 100);

    tools.forEach(({ command, name, icon }) => {
      const btn = document.createElement("button");
      btn.classList.add("i", "i-m", icon);
      btn.addEventListener("click", () => {
        command(view.state, view.dispatch, view);
        view.focus();
      });
      this.buttons[name] = btn;
      this.root.appendChild(btn);
    });
  }

  update(view: EditorView) {
    if (!hasMarkActive(view)) {
      this.hide();
      return;
    }

    this.tools.forEach((tool) => {
      setActive(
        this.buttons[tool.name],
        isMarkActive(view.state, schema.marks[tool.name])
      );
    });

    this.alignElement(view);
  }

  private _alignElement(view: EditorView) {
    const { from, to, empty } = view.state.selection;

    if (!view.editable || empty) {
      this.hide();
      return;
    }

    this.show();

    if (!this.root.offsetParent) {
      this.hide();
      return;
    }

    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const box = this.root.getBoundingClientRect();
    const offsetParentBox = this.root.offsetParent.getBoundingClientRect();
    const left =
      (start.left + end.left) / 2 - box.width / 2 - offsetParentBox.left;

    this.root.style.setProperty(
      "top",
      `${start.top - offsetParentBox.top - box.height}px`
    );
    this.root.style.setProperty("left", `${left < 5 ? 5 : left}px`);
  }

  private show() {
    this.root.classList.add("Visible");
  }

  private hide() {
    this.root.classList.remove("Visible");
  }

  destroy() {
    this.root.remove();
  }
}

interface BubbleMenuOptions {
  target: HTMLElement;
  tools: EditorTool[];
}

export const bubbleMenu = (options: BubbleMenuOptions): Plugin => {
  return new Plugin({
    view(view) {
      const { target, tools } = options;
      return new BubbleMenuView(view, target, tools);
    },
  });
};
