import { Schema } from "prosemirror-model";

export const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [
        {
          tag: "p",
        },
      ],
      toDOM: () => {
        return ["p", 0];
      },
    },
    hr: {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["hr"];
      },
    },
    text: {
      group: "inline",
    },
    heading: {
      attrs: {
        level: {
          default: 1,
          validate: "number",
        },
      },
      marks: "",
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM(node) {
        const tag = `h${node.attrs.level}`;
        return [tag, 0];
      },
    },
    image: {
      attrs: {
        src: { validate: "string" },
      },
      group: "block",
      draggable: true,
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs(dom: HTMLElement) {
            return {
              src: dom.getAttribute("src"),
            };
          },
        },
      ],
      toDOM(node) {
        let { src } = node.attrs;
        return ["figure", ["img", { src }]];
      },
    },
    blockquote: {
      content: "block+",
      group: "block",
      defining: true,
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      },
    },
  },
  marks: {
    bold: {
      parseDOM: [{ tag: "b" }],
      toDOM() {
        return ["b", 0];
      },
    },
    italic: {
      parseDOM: [{ tag: "i" }],
      toDOM() {
        return ["i", 0];
      },
    },
    del: {
      parseDOM: [{ tag: "del" }],
      toDOM() {
        return ["del", 0];
      },
    },
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code", 0];
      },
    },
    link: {
      attrs: {
        href: { validate: "string" },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs(dom: HTMLElement) {
            return {
              href: dom.getAttribute("href"),
            };
          },
        },
      ],
      toDOM(node) {
        let { href } = node.attrs;
        return ["a", { href }, 0];
      },
    },
  },
});
