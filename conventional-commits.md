# Git Commit Convention

[中文](./conventional-commits.zh.md)

## 0. Git Branching & Release Workflow
1. **main branch**  
   - Used exclusively for production releases. All code to be deployed must be merged into the main branch via a Pull Request (PR).  
   - Immediately tag the merge commit after merging. Naming format: `v{major}.{breaking or major change}.{patch}[-additional description]`, e.g., `v1.0.1`, `v1.0.1-beta`.
   - Hotfix Handling: For fixes to released versions, create a branch prefixed with `hotfix/` from the main branch. After completing the fix, merge it back into the main branch via a PR.

2. **dev branch**  
   - Serves as the daily development integration branch. Unreleased features/fixes must first submit a PR to the dev branch.  
   - The dev branch can be merged into the main branch for releases.

3. **docs branch**  
   - Dedicated to documentation updates. It receives PRs from or is directly merged from the dev branch.
   - Documentation Hotfix: When fixing online documentation issues, create a branch prefixed with `hotfix-docs/` from the docs branch. After completing the fix, merge it back into the docs branch via a PR.

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