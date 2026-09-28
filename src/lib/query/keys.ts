export const queryKeys = {
  clips: {
    all: ['clips'] as const,
    list: () => [...queryKeys.clips.all, 'list'] as const,
    count: () => [...queryKeys.clips.all, 'count'] as const,
    detail: (id: string) => [...queryKeys.clips.all, 'detail', id] as const,
  },
  filmstrip: (uri: string, frames: number) => ['filmstrip', uri, frames] as const,
} as const;
