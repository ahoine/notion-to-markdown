# Notion to Markdown Converter

一个能够完整抓取 Notion 页面内容并转换为 Markdown 文件的工具。
## 功能特性
- ✅ 支持通过 Notion API 抓取页面内容
- ✅ 支持各种 Notion 元素类型的转换
- ✅ 提供简单易用的命令行接口
- ✅ 支持单个页面和批量页面转换
- ✅ 支持自定义输出目录
- ✅ 支持通过命令行指定 API token

## 支持的 Notion 元素类型

- 段落 (Paragraph)
- 标题 (Heading 1-6)
- 无序列表 (Bulleted List)
- 有序列表 (Numbered List)
- 待办事项 (To-do List)
- 切换块 (Toggle)
- 子页面 (Child Page)
- 图片 (Image)
- 分隔线 (Divider)
- 引用 (Quote)
- 代码块 (Code)
- 表格 (Table)
- 呼出块 (Callout)
- 嵌入 (Embed)
- 书签 (Bookmark)
- 链接预览 (Link Preview)
- 公式 (Equation)
- 文件 (File)
- PDF
- 视频 (Video)
- 音频 (Audio)

## 安装

### 全局安装

```bash
npm install -g .
```

### 本地安装

```bash
npm install
```

## 配置

1. 复制 `.env.example` 文件为 `.env`
2. 在 `.env` 文件中填写你的 Notion API token

```env
# Notion API Token
NOTION_API_TOKEN=your_notion_api_token_here
```

## 使用方法

### 转换单个页面

```bash
notion2md --page <pageId>
```

或使用本地安装方式：

```bash
node src/cli.js --page <pageId>
```

### 批量转换多个页面

1. 创建一个包含页面 ID 的文本文件，每个页面 ID 占一行
2. 运行批量转换命令：
```bash
notion2md --batch <filePath>
```

### 自定义输出目录
```bash
notion2md --page <pageId> --output <directory>
```

### 通过命令行指定 API token

```bash
notion2md --page <pageId> --token <apiToken>
```

## 示例

### 转换单个页面

```bash
notion2md --page 1234567890abcdef1234567890abcdef
```

### 批量转换

创建 `pages.txt` 文件：
```
1234567890abcdef1234567890abcdef
0987654321fedcba0987654321fedcba
```

然后运行：
```bash
notion2md --batch pages.txt
```

## 注意事项

- 需要有效的 Notion API token
- 需要对目标页面有访问权限
- 转换后的 Markdown 文件会保存在指定的输出目录中
- 对于复杂的 Notion 元素，转换结果可能会有所简化

## 依赖

- @notionhq/client - Notion API 客户端
- commander - 命令行参数解析
- dotenv - 环境变量管理
- fs-extra - 文件系统操作

## 许可证
MIT

