---
title: A2UI 协议详解：Agent 与用户界面的新范式
date: 2026-08-20
category: ai
tags: [A2UI, Agent, 协议, Google]
summary: A2UI 是一套开放协议，让 AI Agent 能向客户端发送声明式 UI 描述，由原生组件渲染交互界面。本文拆解其结构、运行机制与适用场景。
aiSummary: true
cover: /covers/a2ui.svg
---

## 什么是 A2UI

**A2UI（Agent-to-User Interface）** 是一个开放协议标准，由 Google 主导、CopilotKit 及开源社区共同贡献，采用 Apache 2.0 许可。它的核心使命是：让 AI Agent 能够安全地向客户端发送**声明式**的 UI 描述，由客户端使用自己的原生组件库渲染出来。

## 核心机制

Agent 不再返回一段 HTML 或截图，而是发送结构化的 JSON 描述界面意图，客户端据此渲染原生控件：

```json
{
  "type": "form",
  "fields": [
    { "name": "email", "label": "邮箱", "required": true },
    { "name": "freq", "label": "更新频率", "options": ["每日", "每周"] }
  ]
}
```

## 与 MCP 的关系

MCP 解决 Agent 与工具/外部系统的连接，而 A2UI 解决 Agent 与「人」的交互呈现——两者互补，构成「工具连接 + 界面呈现」的完整闭环。

> 声明式优于命令式：Agent 只描述「要什么」，不关心「怎么画」，从而跨平台、跨端保持一致体验。

## 适用场景

- 表单填写、问卷、配置面板
- 多步骤流程（如订单处理：草稿 → 提交 → 审批）
- 跨桌面/移动原生客户端的统一交互
