import { DOMSerializer, DOMParser, Fragment, Schema } from "prosemirror-model";

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
