# FiveSec

A video diary built around a single constraint: every entry is exactly five seconds.

Import a video from your library, slide a fixed five-second window to the moment worth keeping,
name it, and it lands in your diary.

## Running the app

The trimmer is native code, so how you run FiveSec decides what you can do with it.

| | Expo Go | Preview / development build |
| --- | --- | --- |
| Browse, play, edit, delete clips | yes | yes |
| Pick or record a source video | yes | yes |
| Scrub the five-second window and preview it | yes | yes |
| Export a clip | no | yes |

`expo-trim-video`, the library this case study asks for, ships Swift and Kotlin. Expo Go runs a fixed
native runtime that cannot load it, so **Crop and save** fails there and says so. That is a property
of the library, not a bug in the app, and no JavaScript fallback can trim a video on device. To see
the whole flow, install a build.

### Preview build, nothing to compile

```bash
npm install -g eas-cli
eas login

npm run build:apk          # Android APK, installable from the build link
npm run build:simulator    # iOS .app for the Xcode Simulator
```

Both are standalone: install and open, no Metro server needed.

### Building from GitHub Actions

`.github/workflows/eas-build.yml` queues the same EAS builds from GitHub's runners, so the project
upload never leaves GitHub. Useful when a local network blocks the upload to EAS.

1. Create an access token at expo.dev under Account settings, Access tokens.
2. Add it to the repository as the `EXPO_TOKEN` Actions secret.
3. Run **EAS Build** from the Actions tab and pick a platform and profile.

The job exits once the build is queued; follow it on expo.dev. A finished store build is sent to App
Store Connect with `eas submit --platform ios --latest`, which uploads from EAS, not from your machine.

### Expo Go

```bash
npm install
npm start
```

Scan the QR code, or press `i` / `a` for a simulator. Everything except exporting works.

### Local native build

```bash
npm run build:android      # needs Android Studio, JAVA_HOME and ANDROID_HOME
npm run build:ios          # needs macOS with Xcode
```

`expo-trim-video` was published against an older SDK. It autolinks under SDK 57 and
`:expo-trim-video:compileDebugKotlin` succeeds against React Native 0.86, so no patch or fork is
needed.

## Requirements

- Node.js 20 or newer
- Expo Go, or a preview build, on a device or simulator
- Xcode or Android Studio only if you build natively yourself

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Metro dev server |
| `npm run start:clear` | Dev server with a cleared cache |
| `npm run ios` / `npm run android` | Open in a simulator through Expo Go |
| `npm run build:apk` | EAS preview APK |
| `npm run build:simulator` | EAS iOS simulator build |
| `npm run build:dev` | EAS development-client build (Android) |
| `npm run build:dev:simulator` | EAS development-client build (iOS Simulator) |
| `npm run verify` | Type check and lint |
| `npm run build:ios` / `npm run build:android` | Local native build |
| `npm run prebuild` | Regenerate the native projects after an `app.json` change |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run doctor` | Expo project validation |

## Developing

### The loop

Expo Go is enough while you are working on screens, navigation, state, queries or styling.
Everything except export runs there with fast refresh, so most changes need no native build at all.

The moment you touch the export path, build a development client once:

```bash
npm run build:dev              # EAS, Android APK
npm run build:dev:simulator    # EAS, iOS Simulator
npm run build:android          # local, needs Android Studio
npm run build:ios              # local, needs macOS and Xcode
```

Install it, then run `npm start` and open the project from that build instead of Expo Go. JavaScript
fast-refreshes exactly as it does in Expo Go, except the trimmer is linked, so **Crop and save**
works.

### When a rebuild is actually needed

Only when native code changes:

- adding a dependency that ships native code
- editing `plugins`, `ios` or `android` in `app.json`, including icons, splash and permission strings
- bumping the Expo SDK

Everything else is JavaScript and reloads instantly. After an `app.json` change run
`npm run prebuild` to re-apply the config, then build again. The `ios` and `android` directories are
generated and gitignored; they are rebuilt from `app.json` on demand.

### Changing the database

`clips` is created by a numbered migration guarded by `PRAGMA user_version`. Editing the
`CREATE TABLE` in migration 1 changes nothing on a device that already ran it. Append a new entry to
`migrations` in `src/db/migrations.ts` and raise `SCHEMA_VERSION` in `src/db/schema.ts`, or reinstall
the app to start from an empty database.

### Styling a new third-party component

If a component outside NativeWind's registry needs `className`, register it in
`src/theme/interop.ts`. Without that the prop is dropped silently and the component renders
unstyled. See [Styling third-party components](#styling-third-party-components).

### Before committing

```bash
npm run verify    # tsc --noEmit && eslint .
npm run doctor    # Expo config and SDK version matrix
```

### Local build prerequisites

Android needs Android Studio and the two environment variables it does not set for you:

```powershell
$env:JAVA_HOME  = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
```

iOS requires macOS with Xcode. There is no way to compile an iOS app on Windows, so use
`npm run build:dev:simulator` or `npm run build:simulator` on EAS instead.

## Usage

**Library** lists every clip newest first, with a thumbnail, duration badge and relative date. It
pages in batches of twelve as you scroll and pull-to-refresh re-reads the database.

**New clip** opens a three-step flow:

1. **Source** — pick a video at least five seconds long from the library, or record one with the
   camera.
2. **Window** — a filmstrip renders across the source duration. Drag the window or tap where it
   should land. Tapping the video or the play button under it plays back exactly the selected five
   seconds, and the readout shows the in and out timecodes.
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

### Styling third-party components

NativeWind only maps `className` onto its own registry of React Native components. Anything outside
it, such as `VideoView`, receives `className` as an unknown prop and silently renders unstyled.
`src/theme/interop.ts` registers the third-party components this app styles with `className`, and the
root layout imports it before the first render.

Animated views take plain style objects instead. Their styles are produced inside worklets, so
keeping the whole style in one place avoids merging a compiled class list with a shared-value style
on every frame.

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
