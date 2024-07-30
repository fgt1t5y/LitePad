interface Model {
  id?: number;
  created_at: Date;
  updated_at: Date;
  meta?: string;
}

export interface Notebook extends Model {
  name: string;
  description?: string;
  password?: string;
  password_salt?: string;
}

export interface Note extends Model {
  notebook_id?: number;
  folder_id?: number;
  note_type: string;
  title: string;
  content_type: string;
  content: string;
  preview: string;
  labels: string[];
}
