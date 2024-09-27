import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import {
  DOMSerializer,
  DOMParser,
  Fragment,
  Schema,
  MarkType,
} from "prosemirror-model";

export const isMarkActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};

export const setDisabled = (el: HTMLElement, on: boolean) => {
  if (on) {
    el.setAttribute("disabled", "");
  } else {
    el.removeAttribute("disabled");
  }
};

export const setActive = (el: HTMLElement, on: boolean) => {
  if (on) {
    el.classList.add("ToolActive");
  } else {
    el.classList.remove("ToolActive");
  }
};

export const hasMarkActive = (view: EditorView) => {
  const node = view.state.selection.$from.node(1);

  if (!node) return false;

  // 如果node的mark属性为空字符串，即不能插入mark
  // 则直接返回false
  if (node.type.spec.marks === "") return false;

  return node.hasMarkup(node.type);
};

const removeWhitespaces = (node: HTMLElement) => {
  const children = node.childNodes;

  for (let i = children.length - 1; i >= 0; i -= 1) {
    const child = children[i];

    if (
      child.nodeType === 3 &&
      child.nodeValue &&
      /^(\n\s\s|\n)$/.test(child.nodeValue)
    ) {
      node.removeChild(child);
    } else if (child.nodeType === 1) {
      removeWhitespaces(child as HTMLElement);
    }
  }

  return node;
};

export function elementFromString(value: string): HTMLElement {
  // add a wrapper to preserve leading and trailing whitespace
  const wrappedValue = `<body>${value}</body>`;

  const html = new window.DOMParser().parseFromString(
    wrappedValue,
    "text/html"
  ).body;

  return removeWhitespaces(html);
}

export function getHTMLFromFragment(
  fragment: Fragment,
  schema: Schema
): string {
  const documentFragment =
    DOMSerializer.fromSchema(schema).serializeFragment(fragment);

  const temporaryDocument = document.implementation.createHTMLDocument();
  const container = temporaryDocument.createElement("div");

  container.appendChild(documentFragment);

  return container.innerHTML;
}

export function createNodeFromContent(content: string, schema: Schema) {
  const parser = DOMParser.fromSchema(schema);

  return parser.parse(elementFromString(content));
}
