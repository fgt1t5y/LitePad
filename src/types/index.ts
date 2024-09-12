import type { Command } from "prosemirror-state";

interface Model {
  id?: number;
  created_at: Date;
  updated_at: Date;
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
  preview: string;
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

export interface IconMap {
  [type: string]: string;
}

export interface AppStat {
  last_notebook: number;
}

export interface PatchedKeepAlive {
  pruneCacheEntry: (key: any) => void;
}

export interface EditorTool {
  command: Command;
  name: string;
  key?: string;
  icon: string;
}
