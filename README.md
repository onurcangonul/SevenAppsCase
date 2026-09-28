# FiveSec

A video diary built around a single constraint: every entry is exactly five seconds.

Import a video from your library, slide a fixed five-second window to the moment worth keeping,
name it, and it lands in your diary.

## Requirements

- Node.js 20 or newer
- Expo Go on a physical device, or an iOS Simulator / Android Emulator
- Xcode (iOS) or Android Studio (Android) for development builds

## Setup

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `i` / `a` to open a simulator.

### Trimming requires a development build

`expo-trim-video` is a native module and is not part of the Expo Go runtime. The app detects this at
startup: every screen, the picker, the timeline and the preview all work in Expo Go, but exporting a
clip needs the native trimmer.

```bash
npm run build:ios
npm run build:android
```

Both commands run `expo run:*`, which generates the native projects and installs a development
build with the trimmer linked.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Metro dev server |
| `npm run start:clear` | Dev server with a cleared cache |
| `npm run ios` / `npm run android` | Open in a simulator through Expo Go |
| `npm run build:ios` / `npm run build:android` | Native development build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run doctor` | Expo project validation |

## Usage

**Library** lists every clip newest first, with a thumbnail, duration badge and relative date. It
pages in batches of twelve as you scroll and pull-to-refresh re-reads the database.

**New clip** opens a three-step flow:

1. **Source** — pick a video at least five seconds long from the library.
2. **Window** — a filmstrip renders across the source duration. Drag the amber window or tap where
   it should land. The readout shows the in and out timecodes; `Preview selection` plays back
   exactly those five seconds.
3. **Details** — name and describe the clip, then `Crop and save` runs the trim.

**Clip detail** plays the saved clip on loop with its name, description and the source in-point.
`Edit` changes the name and description; `Delete` removes the row and its files from disk.

## Architecture

```
app/                          Expo Router routes only
  _layout.tsx                 providers + root stack
  index.tsx                   library
  clip/[id]/index.tsx         detail
  clip/[id]/edit.tsx          edit
  crop/                       three-step wizard stack
src/
  components/                 presentation, no domain knowledge
    ui/                       Text, Button, TextField, Badge, Timecode, Divider, Touchable
    layout/                   Screen, ScreenHeader, StepIndicator, BottomBar
    feedback/                 EmptyState, ErrorNotice, LoadingState, ProgressOverlay
    video/                    VideoPlayer, VideoThumbnail
  features/
    clips/                    schema, read and write hooks, list and form components
    crop/                     draft store, picker, filmstrip, trim mutation, timeline
  db/                         SQLite client, versioned migrations, repository
  lib/
    media/                    native trimmer boundary, clip storage, thumbnails
    query/                    query client and key factory
    errors.ts                 typed error codes and user-facing messages
    format.ts                 timecode, duration and date formatting
  theme/                      palette and font tokens
  constants/                  five-second window, field limits, page size
  types/                      domain types
```

Routes stay thin. They read params, call feature hooks and compose components; nothing in `app/`
knows about SQL, file paths or the native module.

### State ownership

Three kinds of state, three tools, no overlap.

- **SQLite** is the source of truth for saved clips. Schema changes go through numbered migrations
  guarded by `PRAGMA user_version`, and all access goes through `src/db/clipsRepository.ts`.
- **TanStack Query** caches everything read from the repository and owns the async lifecycle. The
  trim itself is a mutation, so progress, errors and retries come from one place. Writes invalidate
  the list and count keys and seed the detail cache.
- **Zustand** holds the crop wizard draft — the chosen source and the window start. It is deliberately
  in memory only: an abandoned draft should not survive a restart. Timeline scrubbing writes straight
  to the store, and only the components subscribed to `startMs` re-render.

### The five-second window

The window length is fixed, so the scrubber exposes one degree of freedom: where it starts. Start
and end are always five seconds apart, which removes the invalid-range states a two-handle scrubber
would allow.

`TrimTimeline` runs the gesture on the UI thread with Reanimated shared values and never re-renders
while dragging. Updates cross to JS on a throttle during the drag and once on release.

### The native module boundary

`expo-trim-video` calls `requireNativeModule` at import time, which throws wherever the module is not
linked. `src/lib/media/trimmer.ts` wraps it with `requireOptionalNativeModule` instead, so the
package's types are used but its entrypoint never enters the bundle. The module resolves to `null` in
Expo Go and the call surfaces a typed `TRIMMER_UNAVAILABLE` error rather than a crash.

A trimmed file lands in the cache directory, where the OS may evict it, so `persistClipFile` moves it
into `documentDirectory/clips` before the row is written. Deleting a clip removes its video and
thumbnail from disk.

### Scaling the list

The library query is a keyset paginator, not an offset one. The cursor is the `(created_at, id)` pair
of the last row, compared as a SQLite row value against the `(created_at DESC, id DESC)` index, so
page cost stays flat as the diary grows and rows cannot be skipped or repeated. Rows are a fixed
height, which lets `FlatList` use `getItemLayout` and skip measurement.

### Brand assets

`assets/logo/` holds the source marks in PNG and SVG. Everything the build consumes is derived from
them:

| File | Use |
| --- | --- |
| `assets/icon.png` | App icon, 1024x1024, opaque and full-bleed |
| `assets/adaptive-icon.png` | Android adaptive foreground, mark centred in the 66% safe zone |
| `assets/splash-icon.png` | Splash mark |
| `assets/logo/five-sec-icon-white.png` | In-app mark, rendered through `src/theme/brand.ts` |

The source art ships with transparent rounded corners. iOS applies its own mask, so the app icon is
flattened onto `#F04642` as an opaque square rather than handing iOS an already-rounded image and
getting notched corners. Android takes the white mark on a `#F04642` background layer, which lets the
launcher mask it to whatever shape the device uses.

The splash sits on the app canvas `#09090B` rather than brand red, so launching does not flash red
before the dark UI mounts.

`#F04642` is also the app accent: the trim window, the active step and emphasised timecodes. It
carries destructive meaning too, so `accent` and `danger` resolve to the same value on purpose
instead of sitting next to a near-identical second red. Only unused source files stay out of the
bundle; Metro ships just the mark that is actually imported.

### Validation

One Zod schema in `src/features/clips/clipSchema.ts` backs both the create and edit forms through
`useClipMetadataForm`, so the wizard and the edit page cannot drift apart.

### Linting note

`react-hooks/immutability` and `react-hooks/purity` are disabled for exactly two files in
`eslint.config.js`. Reanimated shared values and `expo-video`'s `currentTime` setter are mutation-based
APIs by design, and both files use them inside worklets and event callbacks rather than during render.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19.2 |
| Navigation | Expo Router 57 with typed routes |
| Styling | NativeWind 4 with a custom dark theme on `#F04642` |
| Server state | TanStack Query 5 |
| Draft state | Zustand 5 |
| Persistence | Expo SQLite with versioned migrations |
| Video | Expo Video, Expo Video Thumbnails |
| Trimming | expo-trim-video |
| Animation | Reanimated 4, Gesture Handler |
| Forms | React Hook Form with Zod |
| Language | TypeScript, strict |

Native package versions are pinned to the Expo SDK 57 matrix so the project runs in Expo Go without
a version mismatch.
