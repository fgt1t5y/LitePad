import type { Keymap } from "@/types";
import type { Command } from "prosemirror-state";

import {
  setBlockType,
  toggleMark,
  chainCommands,
  exitCode,
} from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { schema } from "@/components/editor/schema";

export const setHardBreak = (): Command => {
  return (state, dispatch) => {
    if (dispatch)
      dispatch(
        state.tr
          .replaceSelectionWith(schema.nodes.hard_break.create())
          .scrollIntoView()
      );
    return true;
  };
};

export const extraKeymap = {
  "Mod-Enter": chainCommands(exitCode, setHardBreak()),
  "Mod-z": undo,
  "Mod-y": redo,
  "Mod-b": toggleMark(schema.marks.bold),
  "Mod-i": toggleMark(schema.marks.italic),
  "Mod-`": toggleMark(schema.marks.code),
  "Mod-1": setBlockType(schema.nodes.heading, { level: 1 }),
  "Mod-2": setBlockType(schema.nodes.heading, { level: 2 }),
  "Mod-3": setBlockType(schema.nodes.heading, { level: 3 }),
  "Mod-4": setBlockType(schema.nodes.heading, { level: 4 }),
  "Mod-5": setBlockType(schema.nodes.heading, { level: 5 }),
  "Mod-6": setBlockType(schema.nodes.heading, { level: 6 }),
  "Mod-0": setBlockType(schema.nodes.paragraph),
  "Mod-q": setBlockType(schema.nodes.blockquote),
} as Keymap;
