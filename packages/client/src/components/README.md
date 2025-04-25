# Component library

In here, put components that are shared across the app,
not belonging to any particular feature.

The idea here is to leverage existing component libraries, but enable easily
switching out themes or a completely different library if needed.

To this end, components in here should have props defined without referencing
any library. The library starts out with basic types, and as you need new functionality
or new components, add them to the library.

## Folder structure

Each component should have its own folder, with the component itself exported by an
`index.tsx` file.

The folder may contain subfolders for `__tests__` and `__stories__`.

## Layout

Use the `Container` component to wrap most things. All layouts should be done using
flexbox layout unless explicitly specified (e.g. grids, tables).

The default container should be `flex: 1` to fill the available space, but it should
be possible to override this with a `flex` prop.
