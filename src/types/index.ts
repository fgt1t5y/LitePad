import type { Command } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

export interface Config {
  lastNotebook?: number;
  showAsidePanel?: boolean;
}

interface Model {
  id?: number;
  created_at: Date;
  updated_at?: Date;
}

export interface Notebook extends Model {
  name: string;
  description?: string;
}

export interface Folder extends Model {
  notebook_id: number;
  folder_id?: number;
  name: string;
  type: string;
}

export interface Note extends Model {
  notebook_id: number;
  folder_id?: number;
  title: string;
  type: string;
  content: string;
  labels: string[];
}

export interface TreeItem {
  id: number;
  label: string;
  type?: string;
  icon?: string;
  children?: TreeItem[];
  [key: string]: any;
}

export interface TreeDnDStat {
  startId?: string;
  endId?: string;
}

export interface PageTabsItem {
  id: number;
  label: string;
  path: string;
}

export interface ListSelectItem {
  id: string | number;
  name: string;
}

export interface IDs {
  [id: number]: any;
}

export interface PatchedKeepAlive {
  pruneCacheEntry: (key: any) => void;
}

export type EditorToolType = "node" | "mark" | "history";

export interface EditorTool {
  command: Command;
  enable?: (view: EditorView) => boolean;
  type: EditorToolType;
  name: string;
  key?: string;
  icon: string;
}

export interface EditorTools {
  history: EditorTool[];
  node: EditorTool[];
  mark: EditorTool[];
}

export interface Keymap {
  [key: string]: Command;
}

export interface ToolBarButton {
  [name: string]: HTMLElement;
}

export interface ToolbarButtons {
  history: ToolBarButton;
  node: ToolBarButton;
  mark: ToolBarButton;
}
