export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  published: boolean;
  display_order: number;
}

export interface Sponsor {
  id: string;
  name: string;
  description?: string;
  link?: string;
  logo_path?: string;
  active: boolean;
  display_order: number;
}

export interface Executive {
  id: string;
  name: string;
  title: string;
  group: 'president' | 'vice_president' | 'assistant_vice_president';
  headshot_path?: string;
  visible: boolean;
  display_order: number;
}

export interface GalleryPhoto {
  id: string;
  image_path?: string;
  alt?: string;
  caption?: string;
  visible: boolean;
  display_order: number;
}

export interface QueryError {
  category: 'auth' | 'forbidden' | 'network' | 'paused' | 'conflict' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

export interface QueryResult<T> {
  data: T[];
  loading: boolean;
  error: QueryError | null;
  refetch: () => Promise<void>;
}
