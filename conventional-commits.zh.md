# Git Commit 规范

[English](./conventional-commits.md)

## 0. Git 分支使用与上线流程
1. **main 分支**  
   - 仅用于发布生产环境，所有上线代码必须通过 Pull Request（PR）合并到 main 分支。  
   - 合并后立即基于合并提交打 Tag，命名格式：`v{大版本}.{破坏性或大规模修改}.{补丁}[-额外说明]`，例如 `v1.0.1`、`v1.0.1-beta`。
   - 热修复处理：已发布版本的修复需从 main 分支拉取 hotfix/ 开头分支，修复完成后通过 PR 合并回 main 分支。

2. **dev 分支**  
   - 作为日常开发集成分支，未发布的功能/修复须先提 PR 到 dev 分支。  
   - dev 分支可合并到 main 分支进行发布。

3. **docs 分支**  
   - 专用于文档更新，从 dev 分支接收 PR 或者直接 merge。
   - 文档热修复：修复线上文档问题时，需从 docs 分支拉取 hotfix-docs/ 开头分支，修复完成后通过 PR 合并回 docs 分支。

## 1. 格式
```
<type>[(<scope>)]: <subject>
[<body>]
[<footer>]
```

## 2. 类型（@commitlint/config-conventional）
| 类型     | 说明 |
|----------|------|
| feat     | 新增功能 |
| fix      | 修复缺陷 |
| docs     | 文档变更 |
| style    | 代码风格（无逻辑改动） |
| refactor | 代码重构 |
| perf     | 性能优化 |
| test     | 测试相关 |
| build    | 构建系统/依赖变动 |
| ci       | CI 配置变更 |
| chore    | 其他杂项（不改源码与测试） |
| revert   | 回滚提交 |

## 3. 示例
```text
feat(components): 增加 Button 组件

- 新增通用按钮组件，支持 primary / secondary / text 三种类型
- 提供 size（small | default | large）与 disabled 状态控制
- 暴露 onClick 事件及 loading 属性，内置防抖逻辑
- 配套 Storybook 示例与单测覆盖率 100%
```

```text
feat(components): 增加 Button 组件
```

## 4. 分支命名
```
<type>/<issue-><简短描述（短横线命名）>
例如：
feature/42-button
feature/add-component-button
```