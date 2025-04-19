# 掘金文章爬虫与向量检索系统

该项目通过爬取掘金网站的热门文章，并将文章内容向量化后存储到Milvus向量数据库中，以便后续进行语义检索和相似文章推荐。

## 功能特点

- 爬取掘金平台的热门文章信息（标题、点赞数、阅读量、简介等）
- 使用向量化API将文章标题转换为向量
- 存储文章数据和向量到Milvus向量数据库
- 支持基于语义的文章检索（通过向量相似度）

## 分支介绍
本分支 `feature/test-frontend` 和 [juejin-crawler-frontend](https://github.com/ShirleyZmj/my-juejin-crawler) 搭配使用。本项目分支负责建立向量数据库，插入数据。

## 技术栈

- **Node.js**：运行环境
- **axios**：用于HTTP请求
- **node-fetch**：用于API调用
- **@zilliz/milvus2-sdk-node**：Milvus数据库NodeJS客户端

## 环境要求

- Node.js >= 16.x
- Milvus 2.x 向量数据库
- 向量化API服务（例如Siliconflow API）

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/ShirleyZmj/juejin-crawl.git
cd juejin-crawl
```

2. 安装依赖
```bash
npm install
```

3. 配置项目
创建`config.local.js`文件（可以基于`config.js`进行修改）:
```javascript
export const config = {
  // Milvus数据库配置
  milvus: {
    address: "你的Milvus地址", 
    port: "19530", 
    username: "用户名",
    password: "密码",
    database: "my-juejin", 
    collection: "articles", 
    vectorDimension: 1024,
  },

  // 向量化API配置
  embedding: {
    url: "向量化API地址",
    apiKey: "你的API密钥", 
    model: "BAAI/bge-large-zh-v1.5", 
  },

  // 爬虫配置
  crawler: {
    url: "https://juejin.cn/hot/articles/1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};
```

## 使用方法

启动爬虫并将数据存入Milvus数据库：

```bash
npm start
```

## 系统流程

1. 爬虫从掘金网站获取热门文章
2. 将文章标题通过API转换为向量
3. 将文章信息和向量存储到Milvus数据库
4. 可以通过Milvus进行语义相似度查询

## 项目结构

- `index.js` - 主程序入口
- `crawl.js` - 掘金爬虫实现
- `milvus.js` - Milvus数据库操作封装
- `utils.js` - 工具函数，包括向量转换
- `config.js` - 配置文件模板
- `config.local.js` - 本地配置文件（需自行创建）

## Milvus数据库Schema设计

项目在Milvus中创建的集合结构如下：

### 集合：articles

| 字段名 | 数据类型 | 描述 | 其他特性 |
| ----- | ------- | ---- | ------- |
| id | Int64 | 主键ID | 自增主键 |
| rank | Int64 | 文章排名 | 爬取时的排名顺序 |
| title | VarChar | 文章标题 | 最大长度512字符 |
| title_vector | FloatVector | 标题向量 | 维度1024 |
| url | VarChar | 文章链接 | 最大长度512字符 |
| likes | Int64 | 点赞数 | 文章获得的点赞数量 |
| views | Int64 | 阅读量 | 文章的阅读数量 |
| briefContent | VarChar | 文章摘要 | 最大长度512字符 |

### 索引配置

在`title_vector`字段上创建了HNSW（层次可导航小世界图）索引，用于高效的向量相似度搜索：

- 索引类型：HNSW
- 相似度度量：COSINE（余弦相似度）
- 参数配置：
  - M：8（每个节点的邻居数）
  - efConstruction：64（构建索引时考虑的邻居数）

这种索引配置适合用于相似文章的快速检索，在保持较高查询精度的同时提供良好的性能。

## 注意事项

- 请确保配置文件中包含正确的API密钥和服务地址
- 需要有可用的Milvus数据库服务
- 爬虫使用需遵守掘金网站的使用条款和爬虫规范
- 向量化API需确保有足够的配额
