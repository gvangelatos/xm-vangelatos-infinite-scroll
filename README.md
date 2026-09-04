# Gallery Template

An Angular photo gallery app with infinite scroll, built on the [Picsum Photos](https://picsum.photos/) API. Photos load progressively as the user scrolls, powered by an `IntersectionObserver`-based directive, with signal-based state management and a favorites feature.

## Features

- **Infinite scroll** — new pages of photos load automatically as you scroll, via a reusable `InfiniteScrollTriggerDirective` that wraps `IntersectionObserver`.
- **Photo details** — view extended info for an individual photo.
- **Favorites** — mark photos as favorites from `PhotosPage`.
- **Optimized images** — uses Angular's `NgOptimizedImage` for performant image loading, `track` in `@for` loops, image `priority`.
- **Dynamic Image Priority** - Images above fold are calculated and given priority with `PriorityCountDirective` for `NgOptimizedImage`
- **Signal-based state** — API and UI state (loading, error, pagination) managed with Angular signals rather than manual subscriptions.
- **Standalone components** — no `NgModule` boilerplate; components declare their own imports directly.
- **On Push Change Detection** - all components use `ChangeDetectionStrategy.OnPush`
- **Activated Route Highlight** - links on header implement `routerLinkActive` to have active view highlighted
- **Signal-based router params** - using `withComponentInputBinding`
- **Angular v22** - project updated to latest angular version
- **Visible Loading State** - In views (`FavouritesPage`,`PhotosPage`,`PhotoDetailsPage`) a loading-spinner is displayed while images are loading
- **Unit Tested** - core app functionalities are unit tested
- **Material Design** - the app is using Angular Material
- **Optimized Routes** - all routes are lazy loaded using `loadComponent`
- **Data Persistence** - Favorites persist after a page refresh thanks to `LocalStorageService`


## Tech stack

- Angular (standalone components, signals, `input()`/`output()` APIs, TypeScript, SCSS)
- RxJS
- Jest for unit testing
- Picsum Photos API as the image data source

## Getting started

### Prerequisites

- Node.js and npm
- Angular CLI
### Install

```bash
npm install
```

### Development server

```bash
ng serve
```
or
```bash
npm run start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source changes.

### Build

```bash
ng build
```
or
```bash
npm run build
```

Build artifacts are output to `dist/`.

### Running unit tests

```bash
npm test
```
or
```bash
npm run test
```

Tests run via Jest (see `jest.config.ts` and `setup-jest.ts` for environment setup, including global mocks for browser APIs like `IntersectionObserver` that aren't implemented in JSDOM).

## Project structure

```
src/app/
├── components/       # Reusable presentational components (e.g. image tile)
├── pages/            # Route-level page components (photos page, photo details page, favorites page)
├── directives/       # Custom directives (e.g. infinite scroll trigger)
├── services/         # API and state services (e.g. photo API, favorites, localStorage)
├── models/           # TypeScript interfaces
├── testing/          # Mocks for unit tests
└── constants/        # Shared constants (page size, tile size, etc.)
```


## Development server

Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` or `npm run test` to execute the unit tests via Jest.
