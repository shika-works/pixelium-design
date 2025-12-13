# Git Commit Convention

[中文](./conventional-commits.zh.md)

## 0. Git Branching & Release Workflow
1. **main branch**  
   - Serves as the release branch. All production-ready code must reach main through a Pull Request (PR).  
   - Tag immediately after merge: `v{major}.{breaking/large-change}.{patch}[-extra]`, e.g. `v1.0.1`, `v1.0.1-beta`.

2. **dev branch**  
   - The integration branch for unreleased features/fixes. Open PRs against dev first.  
   - Dev can be merged into main.

3. **docs branch**  
   - Reserved for documentation updates; accepts PRs or direct merges **only** from dev.

## 1. 格式
```
<type>[(<scope>)]: <subject>
[<body>]
[<footer>]
```

## 2. Types (from @commitlint/config-conventional)
| Type     | Purpose |
|----------|---------|
| feat     | A new feature |
| fix      | A bug fix |
| docs     | Documentation only changes |
| style    | Changes that do not affect the meaning of the code |
| refactor | A code change that neither fixes a bug nor adds a feature |
| perf     | A code change that improves performance |
| test     | Adding missing tests or correcting existing tests |
| build    | Changes that affect the build system or external dependencies |
| ci       | Changes to CI configuration files and scripts |
| chore    | Other changes that don't modify src or test files |
| revert   | Reverts a previous commit |

## 3. Examples
```text
feat(components): add Button component

- Introduce generic button with primary/secondary/text variants
- Support size (small | default | large) and disabled state
- Emit onClick event and provide built-in debounce & loading prop
- Include Storybook stories and 100% unit test coverage
```

```text
feat(components): add Button component
```

## 4. Branch Naming
```
<type>/<issue-><short-desc (kebab-case)>
For example:
feature/42-button
feature/add-component-button
```