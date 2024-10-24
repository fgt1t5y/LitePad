import type { EditorProps } from "prosemirror-view";
import type { Attrs, Mark, Schema, Slice } from "prosemirror-model";
import type { Ref } from "vue";
import type { Keymap } from "@/types";

// @ts-ignore
import { __serializeForClipboard, EditorView } from "prosemirror-view";
import { EditorState, Transaction } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import {
  baseKeymap,
  setBlockType,
  toggleMark,
  deleteSelection,
  selectAll,
} from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { customRef, markRaw } from "vue";
import {
  isMarkActive,
  isNodeActive,
  createDocument,
  createNodeFromContent,
  getHTMLFromFragment,
} from "./helper";
import {
  search,
  setSearchState,
  getSearchState,
  SearchQuery,
  replaceCurrent,
  replaceAll,
  findPrev,
  findNext,
  getSearchMatchingRanges,
} from "./search";
import { dragHandle } from "./draghandle";

interface EventArgument {
  update: { editor: Editor; tr: Transaction };
  selectionUpdate: { editor: Editor; tr: Transaction };
  beforeTransaction: {
    editor: Editor;
    tr: Transaction;
    nextState: EditorState;
  };
  transaction: { editor: Editor; tr: Transaction };
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
   * Editor editable.
   */
  editable?: boolean;
  /**
   * When content changed, will invoke it.
   * @param props Handle's arguments.
   * @returns void
   */
  onUpdate?: (argv: EventArgument["update"]) => void;
  onSelectionUpdate?: (argv: EventArgument["selectionUpdate"]) => void;
  onTransaction?: (argv: EventArgument["transaction"]) => void;
}

export class Editor {
  public view!: EditorView | null;
  public schema: Schema;
  public keymap: Keymap;
  private callbacks: EventCallbacks;

  constructor(options: EditorOptions) {
    this.schema = options.schema;
    this.keymap = options.keymap;
    this.callbacks = {
      update: [],
      selectionUpdate: [],
      beforeTransaction: [],
      transaction: [],
    };

    this.setupView(options);

    if (options.onUpdate) {
      this.on("update", options.onUpdate);
    }
    if (options.onSelectionUpdate) {
      this.on("selectionUpdate", options.onSelectionUpdate);
    }
    if (options.onTransaction) {
      this.on("transaction", options.onTransaction);
    }
  }

  private setupView({
    mount,
    content,
    props,
    autoFocus,
    editable,
  }: EditorOptions) {
    const doc = createDocument(content, this.schema);

    this.view = new EditorView(
      { mount },
      {
        ...props,
        editable: () => editable || true,
        state: EditorState.create({
          doc,
          plugins: [
            keymap(baseKeymap),
            keymap(this.keymap),
            history(),
            search(),
            dropCursor(),
            gapCursor(),
            dragHandle({
              dragHandleWidth: 30,
              scrollTreshold: 50,
              excludedTags: ["hr"],
            }),
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

    const selectionChanged = !this.state.selection.eq(state.selection);

    this.emit("beforeTransaction", {
      editor: this,
      tr,
      nextState: state,
    });

    this.view.updateState(state);

    this.emit("transaction", { editor: this, tr });

    if (selectionChanged) {
      this.emit("selectionUpdate", { editor: this, tr });
    }

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

  public off<EventName extends StringKeyOf<EventArgument>>(
    type: EventName,
    callback?: CallbackFunction<EventArgument, EventName>
  ) {
    const fns = this.callbacks[type];

    if (fns) {
      this.callbacks[type] = fns.filter((fn) => callback !== fn);
    } else {
      this.callbacks[type] = [];
    }
  }

  public emit(type: EventName, argv: CallbackType<EventArgument, EventName>) {
    const fns = this.callbacks[type];

    if (fns.length) {
      fns.forEach((fn) => fn(argv));
    }
  }

  public setEditable(editable: boolean) {
    this.view!.setProps({ editable: () => editable });
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

  public isNodeActive(name: string, attr?: Attrs) {
    const nodeType = this.schema.nodes[name];
    if (!nodeType) return false;

    return isNodeActive(this.state, nodeType, attr);
  }

  public getMarkAttributes(name: string): Attrs {
    const markType = this.schema.marks[name];
    if (!markType) return {};

    const { from, to, empty } = this.state.selection;
    const marks: Mark[] = [];

    if (empty) {
      if (this.state.storedMarks) {
        marks.push(...this.state.storedMarks);
      }

      marks.push(...this.state.selection.$head.marks());
    } else {
      this.state.doc.nodesBetween(from, to, (node) => {
        marks.push(...node.marks);
      });
    }

    const mark = marks.find((markItem) => markItem.type.name === markType.name);

    if (!mark) return {};
    else return { ...mark.attrs };
  }

  public setMarkAttributes(name: string, attr?: Attrs) {
    const markType = this.schema.marks[name];
    if (!markType) return {};

    const { $from } = this.state.selection;

    const from = $from.pos - $from.textOffset;
    const to = from + (this.state.doc.nodeAt(from)?.nodeSize || 0);

    const link = markType.create(attr);

    this.view!.dispatch(this.state.tr.addMark(from, to, link));

    this.focus();
  }

  public hasSelection() {
    const { empty } = this.state.selection;

    return !empty;
  }

  public toggleMark(name: string, attr?: Attrs) {
    const markType = this.schema.marks[name];
    if (!markType) return;

    toggleMark(markType, attr)(this.state, this.view!.dispatch);

    this.focus();
  }

  public clearMark(name: string) {
    const markType = this.schema.marks[name];
    if (!markType) return {};

    const { $from } = this.state.selection;

    const from = $from.pos - $from.textOffset;
    const to = from + (this.state.doc.nodeAt(from)?.nodeSize || 0);

    this.view!.dispatch(this.state.tr.removeMark(from, to, markType));

    this.focus();
  }

  public clearAllMark() {
    const { from, to } = this.state.selection;

    this.view!.dispatch(this.state.tr.removeMark(from, to, null));

    this.focus();
  }

  public setBlockType(name: string, attr?: Attrs) {
    const nodeType = this.schema.nodes[name];
    if (!nodeType) return;

    setBlockType(nodeType, attr)(this.state, this.view!.dispatch);

    this.focus();
  }

  public find(
    search: string,
    replace: string,
    caseSensitive: boolean,
    regexp: boolean
  ) {
    const query = new SearchQuery({
      search,
      replace,
      caseSensitive,
      regexp,
    });
    const tr = this.state.tr;

    this.view!.dispatch(setSearchState(tr, query));
  }

  public clearFind() {
    this.find("", "", false, false);
  }

  public getSearchState() {
    return getSearchState(this.state);
  }

  public getMatchCount() {
    return getSearchMatchingRanges(this.state)?.length || 0;
  }

  /// Get the index of the match of the current active search
  /// that has the same range of the current selection.
  /// Will return -1 if no matching text matches the selection,
  /// or `undefined` is the search plugin isn't active.
  public getCurrentMatchIndex() {
    const ranges = getSearchMatchingRanges(this.state);
    const selection = this.state.selection;

    if (!ranges) return 0;

    return ranges.findIndex(
      ({ from, to }) => from === selection.from && to === selection.to
    );
  }

  public findPrev() {
    if (!this.getSearchState()) return;

    return findPrev(this.state, this.view!.dispatch);
  }

  public findNext() {
    if (!this.getSearchState()) return;

    return findNext(this.state, this.view!.dispatch);
  }

  public replaceCurrent() {
    return replaceCurrent(this.state, this.view!.dispatch);
  }

  public replaceAll() {
    return replaceAll(this.state, this.view!.dispatch);
  }

  public deleteSelection() {
    deleteSelection(this.state, this.view!.dispatch);

    this.focus();
  }

  public getCoordPosition(): { left: number; bottom: number } {
    const { from, to } = this.state.selection;

    const start = this.view!.coordsAtPos(from);
    const end = this.view!.coordsAtPos(to);
    const box = this.view!.dom.offsetParent?.getBoundingClientRect();

    return {
      left: Math.max((start.left + end.left) / 2, start.left + 3),
      bottom: box!.bottom - start.top,
    };
  }

  // 封装导出的内部函数
  public serializeForClipboard(slice: Slice): {
    dom: HTMLDivElement;
    text: string;
    slice: Slice;
  } {
    return __serializeForClipboard(this.view, slice);
  }

  public serializeSelectionForClipboard() {
    return this.serializeForClipboard(this.state.selection.content());
  }

  public paste(html: string) {
    this.view!.pasteHTML(html);

    this.view!.focus();
  }

  public selectAll() {
    selectAll(this.state, this.view!.dispatch, this.view!);

    this.focus();
  }

  public get textCount() {
    const { doc } = this.state;
    return doc.textBetween(0, doc.content.size, undefined, " ").length;
  }

  public get state(): EditorState {
    return this.view!.state;
  }

  public get isEditable() {
    return this.view!.editable;
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
