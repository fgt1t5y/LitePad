import { Schema } from 'prosemirror-model';

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => {
        return ['p', 0]
      },
      parseDOM: [{
        tag: 'p'
      }]
    },
    text: {
      group: 'inline'
    },
    heading: {
      attrs: {
        level: {
          default: 1
        }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      toDOM(node) {
        const tag = `h${node.attrs.level}`
        return [tag, 0]
      },
      parseDOM: [
        {tag: "h1", attrs: {level: 1}},
        {tag: "h2", attrs: {level: 2}},
        {tag: "h3", attrs: {level: 3}},
        {tag: "h4", attrs: {level: 4}},
        {tag: "h5", attrs: {level: 5}},
        {tag: "h6", attrs: {level: 6}}
      ],
    }
  },
  marks: {
    bold: {
      toDOM() {
        return ['strong', 0]
      },
      parseDOM: [
        { tag: 'strong' },
      ],
    }
  }
})
