# Color CLI

A small utility to create a theme with the material color utilities to quickly create a theme. It writes the theme JSON to the standard out. It is up to you to pipe it to a file.

## Usage

```
node index.js 0x008000
```

Colors are passed as numbers e.g. "#008000" is 0x008000

### Writing to file (unix)

```
node index.js 0x008000 > theme.json
```
