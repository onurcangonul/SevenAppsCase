export type Clip = {
  id: string;
  name: string;
  description: string;
  uri: string;
  thumbnailUri: string | null;
  durationMs: number;
  sourceStartMs: number;
  createdAt: number;
  updatedAt: number;
};

export type ClipMetadata = Pick<Clip, 'name' | 'description'>;

export type NewClip = Omit<Clip, 'createdAt' | 'updatedAt'>;

export type ClipCursor = {
  createdAt: number;
  id: string;
};

export type ClipPage = {
  items: Clip[];
  nextCursor: ClipCursor | null;
};
