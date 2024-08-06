interface Model {
  id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Notebook extends Model {
  name: string;
  description?: string;
  password?: string;
  password_salt?: string;
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

export interface TabsItem {
  key: number;
  label: string;
}
