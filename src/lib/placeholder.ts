import { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { setClass } from "@/utils/helpers";

class PlaceholderView {
  constructor(view: EditorView) {
    this.checkEmpty(view);
  }

  update(view: EditorView) {
    this.checkEmpty(view);
  }

  private checkEmpty(view: EditorView) {
    const isEmpty = view.state.doc.content.size === 2;

    setClass(view.dom, "isEmpty", isEmpty);
  }
}

export const placeholder = (): Plugin => {
  return new Plugin({
    view(view) {
      return new PlaceholderView(view);
    },
  });
};
