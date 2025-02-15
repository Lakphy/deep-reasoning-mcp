# Deep Reasoning Server

基于 Model Context Protocol (MCP) 的深度推理服务器，提供强大的深度分析和推理能力。

## 功能特点

- 🧠 **深度推理分析**：使用 deepseek-r1 模型进行复杂的推理任务，支持通过命令行参数指定模型
- 🔄 **MCP 架构**：基于 Model Context Protocol，支持灵活的模型交互
- 🛠 **TypeScript 支持**：完整的类型支持，提供更好的开发体验
- 🔌 **OpenRouter 集成**：通过 OpenRouter 访问多种 AI 服务

## 使用方法

### Cursor

```bash
npx -y deep-reasoning-mcp --apiKey=<YOUR_OPENROUTER_API_KEY> --model=<YOUR_MODEL>
```

## 技术架构

- **模型接口层**：使用 @modelcontextprotocol/sdk 实现 MCP 协议支持
- **AI 服务层**：通过 @openrouter/ai-sdk-provider 连接 OpenRouter
- **推理逻辑层**：处理输入数据并生成分析结果

## 依赖项

- @modelcontextprotocol/sdk
- @openrouter/ai-sdk-provider
- zod
- ai

## 开发说明

项目使用 TypeScript 开发，确保代码质量和类型安全。主要文件说明：

- `src/index.ts`：服务器入口和主要逻辑
- `src/prompt.ts`：推理模型的提示词和响应处理

## 许可证

[MIT License](LICENSE)
