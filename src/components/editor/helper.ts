import type { EditorState, NodeSelection } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Node, NodeType } from "prosemirror-model";

import {
  DOMSerializer,
  DOMParser,
  Fragment,
  Schema,
  MarkType,
} from "prosemirror-model";
import type { Keymap } from "@/types";

export const isMarkActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;

  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};

export const isNodeActive = (
  state: EditorState,
  type: NodeType,
  attributes = {}
) => {
  const { $from, to, node } = state.selection as NodeSelection;

  if (node) return node.hasMarkup(type, attributes);
  else return to <= $from.end() && $from.parent.hasMarkup(type, attributes);
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

export const elementFromString = (value: string) => {
  // add a wrapper to preserve leading and trailing whitespace
  const wrappedValue = `<body>${value}</body>`;

  const html = new window.DOMParser().parseFromString(
    wrappedValue,
    "text/html"
  ).body;

  return removeWhitespaces(html);
};

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

export const createDocument = (content: string, schema: Schema): Node => {
  return createNodeFromContent(content, schema) as Node;
};

export function createNodeFromContent(content: string, schema: Schema) {
  const parser = DOMParser.fromSchema(schema);

  return parser.parse(elementFromString(content));
}

export const absoluteRect = (node: Element) => {
  const data = node.getBoundingClientRect();

  return {
    top: data.top,
    left: data.left,
    width: data.width,
  };
};

export const nodeDOMAtCoords = (coords: { x: number; y: number }) => {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find(
      (elem: Element) =>
        elem.parentElement?.matches?.(".ProseMirror") ||
        elem.matches(
          [
            "li",
            "p:not(:first-child)",
            "pre",
            "blockquote",
            "h1, h2, h3, h4, h5, h6",
          ].join(", ")
        )
    );
};

export const nodePosAtDOM = (
  node: Element,
  view: EditorView,
  offsetX: number
) => {
  const boundingRect = node.getBoundingClientRect();

  return view.posAtCoords({
    left: boundingRect.left + 50 + offsetX,
    top: boundingRect.top + 1,
  })?.inside;
};

export const calcNodePos = (pos: number, view: EditorView) => {
  const $pos = view.state.doc.resolve(pos);
  if ($pos.depth > 1) return $pos.before($pos.depth);
  return pos;
};

export const concatKeymap = (value1: Keymap, value2: Keymap) => ({
  ...value1,
  ...value2,
});
