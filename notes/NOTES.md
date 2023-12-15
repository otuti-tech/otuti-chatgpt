---
title: NOTES
creation date: 2023-08-20-Sunday 20:15
modification date: 2023-11-02-Thursday 12:13
---

<!-- markdownlint-disable MD013-->

## Notes

### `manifest.json`

- `background`
  - scripts that respond to events in the browser, such as browser startup or windows being created, and perform actions in response.
- `Content scripts`
  - JavaScript included with your extension, that you will inject into web pages.

![manifest.json](notes/manifest.json.png)

## 2023-08-20-Sunday

### Initialize Project & Git Repo

```bash
pnpm init
```

**Install Dependencies**:

```bash
pnpm add -D prettier eslint-config-prettier
```

- Format all files with prettier

### Migrate to TypeScript. See [TypeScript Docs](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
