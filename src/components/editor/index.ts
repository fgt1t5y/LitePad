import type { EditorProps } from "prosemirror-view";
import type { Schema } from "prosemirror-model";
import type { Ref } from "vue";
import type { Keymap } from "@/types";

import { EditorView } from "prosemirror-view";
import { EditorState, Transaction } from "prosemirror-state";
import {
  isMarkActive,
  isNodeActive,
  createDocument,
  createNodeFromContent,
  getHTMLFromFragment,
} from "./helper";
import { customRef, markRaw } from "vue";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, setBlockType, toggleMark } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { dropCursor } from "prosemirror-dropcursor";

interface EventArgument {
  update: { editor: Editor; tr: Transaction };
  beforeTransaction: {
    editor: Editor;
    tr: Transaction;
    nextState: EditorState;
  };
}

type EventName = keyof EventArgument;
type EventCallbacks = Record<EventName, Function[]>;

type StringKeyOf<T> = Extract<keyof T, string>;
type CallbackType<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>
> = T[EventName];
type CallbackFunction<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>
> = (props: CallbackType<T, EventName>) => any;

interface EditorOptions {
  /**
   * A element as root to place editor.
   */
  mount: HTMLElement;
  /**
   * Initial HTML content.
   */
  content: string;
  /**
   * Editor scheme.
   */
  schema: Schema;
  /**
   * Shortcut scheme.
   */
  keymap: Keymap;
  /**
   * EditorView's prop.
   */
  props?: EditorProps;
  /**
   * Auto focus the editor when editor loaded.
   */
  autoFocus?: boolean;
  /**
   * When content changed, will invoke it.
   * @param props Handle's arguments.
   * @returns void
   */
  onUpdate?: (props: EventArgument["update"]) => void;
}

export class Editor {
  public view!: EditorView | null;
  public schema: Schema;
  public keymap: Keymap;
  private callbacks: EventCallbacks;

  constructor(options: EditorOptions) {
    this.schema = options.schema;
    this.keymap = options.keymap;
    this.callbacks = { update: [], beforeTransaction: [] };

    this.setupView(options);

    if (options.onUpdate) {
      this.on("update", options.onUpdate);
    }
  }

  private setupView({ mount, content, props, autoFocus }: EditorOptions) {
    const doc = createDocument(content, this.schema);

    this.view = new EditorView(
      { mount },
      {
        ...props,
        state: EditorState.create({
          doc,
          plugins: [
            keymap(baseKeymap),
            keymap(this.keymap),
            history(),
            dropCursor(),
          ],
        }),
        dispatchTransaction: this.dispatchTransaction.bind(this),
      }
    );

    if (autoFocus) this.view!.focus();
  }

  private dispatchTransaction(tr: Transaction) {
    if (!this.view || this.view.isDestroyed) return;

    const state = this.state.apply(tr);

    this.emit("beforeTransaction", {
      editor: this,
      tr,
      nextState: state,
    });

    this.view.updateState(state);

    if (tr.docChanged) {
      this.emit("update", { editor: this, tr });
    }
  }

  public on<EventName extends StringKeyOf<EventArgument>>(
    type: EventName,
    callback: CallbackFunction<EventArgument, EventName>
  ) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }

    this.callbacks[type].push(callback);
  }

  public emit(type: EventName, argv: CallbackType<EventArgument, EventName>) {
    const fns = this.callbacks[type];

    if (fns.length) {
      fns.forEach((fn) => fn(argv));
    }
  }

  public canUndo() {
    return undo(this.state);
  }

  public canRedo() {
    return redo(this.state);
  }

  public undo() {
    return undo(this.state, this.view!.dispatch);
  }

  public redo() {
    return redo(this.state, this.view!.dispatch);
  }

  public focus() {
    if (this.view) this.view.focus();
  }

  public destroy() {
    if (!this.view || this.view.isDestroyed) return;

    this.view.destroy();
    this.view = null;
  }

  public getHTML() {
    return getHTMLFromFragment(this.state.doc.content, this.schema);
  }

  public setHTML(html: string) {
    if (!html || !this.view) return;

    const { tr, doc } = this.view.state;

    const node = createNodeFromContent(html, this.schema);

    this.view.dispatch(tr.replaceWith(0, doc.content.size, node));
  }

  public isMarkActive(name: string) {
    const markType = this.schema.marks[name];
    if (!markType) return false;

    return isMarkActive(this.state, markType);
  }

  public isNodeActive(name: string, attributes = {}) {
    const nodeType = this.schema.nodes[name];
    if (!nodeType) return false;

    return isNodeActive(this.state, nodeType, attributes);
  }

  public toggleMark(name: string) {
    const markType = this.schema.marks[name];
    if (!markType) return;

    toggleMark(markType)(this.state, this.view!.dispatch);

    this.focus();
  }

  public setNode(name: string, attributes = {}) {
    const nodeType = this.schema.nodes[name];
    if (!nodeType) return;

    setBlockType(nodeType, attributes)(this.state, this.view!.dispatch);

    this.focus();
  }

  public get state(): EditorState {
    return this.view!.state;
  }

  public get isDestroyed() {
    return !this.view;
  }
}

function useDebouncedRef<T>(value: T) {
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        // update state
        value = newValue;

        // update view as soon as possible
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            trigger();
          });
        });
      },
    };
  });
}

export class LitePadEditor extends Editor {
  private reactiveState: Ref<EditorState>;

  constructor(options: EditorOptions) {
    super(options);

    this.reactiveState = useDebouncedRef(this.view!.state);

    this.on("beforeTransaction", ({ nextState }) => {
      this.reactiveState.value = nextState;
    });

    return markRaw(this);
  }

  get state() {
    return this.reactiveState ? this.reactiveState.value : this.view!.state;
  }
}
