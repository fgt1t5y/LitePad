import type { Command } from "prosemirror-state";

import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType } from "prosemirror-commands";
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

const tools = [
  { command: toggleMark(schema.marks.bold), name: "bold" },
  { command: toggleMark(schema.marks.italic), name: "italic" },
  { command: toggleMark(schema.marks.del), name: "del" },
  { command: toggleMark(schema.marks.code), name: "code" },
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
];

class ToolbarView {
  // Editor root element
  root: HTMLElement;
  // Editor's toolbar root element
  wrapper: HTMLElement;

  constructor(view: EditorView, root: HTMLElement) {
    this.root = root;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("Toolbar");
    this.root.prepend(this.wrapper);

    tools.forEach(({ command, name }) => {
      const btn = document.createElement("button");
      btn.innerText = name;
      btn.addEventListener("click", () => {
        command(view.state, view.dispatch, view);
        view.focus();
      });
      this.wrapper.appendChild(btn);
    });
  }

  update() {}

  destory() {
    this.wrapper.remove();
  }
}

export const toolbar = (el: HTMLElement): Plugin => {
  return new Plugin({
    view(view) {
      return new ToolbarView(view, el);
    },
  });
};
