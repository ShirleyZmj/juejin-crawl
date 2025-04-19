English  |  [中文](./README.cn.md)

# Juejin Article Crawler and Vector Retrieval System

This project crawls popular articles from the Juejin website, vectorizes the article content, and stores it in the Milvus vector database for semantic retrieval and similar article recommendations.

## Features

- Crawl popular article information from Juejin platform (title, likes, views, introduction, etc.)
- Convert article titles to vectors using vectorization API
- Store article data and vectors in Milvus vector database
- Support semantic-based article retrieval (via vector similarity)

## Tech Stack

- **Node.js**: Runtime environment
- **axios**: For HTTP requests
- **node-fetch**: For API calls
- **@zilliz/milvus2-sdk-node**: Milvus database NodeJS client

## Requirements

- Node.js >= 16.x
- Milvus 2.x vector database
- Vectorization API service (e.g., Siliconflow API)

## Installation

1. Clone the repository
```bash
git clone https://github.com/ShirleyZmj/juejin-crawl.git
cd juejin-crawl
```

2. Install dependencies
```bash
npm install
```

3. Configure the project
Create a `config.local.js` file (you can modify it based on `config.js`):
```javascript
export const config = {
  // Milvus database configuration
  milvus: {
    address: "your-milvus-address", 
    port: "19530", 
    username: "username",
    password: "password",
    database: "juejin", 
    collection: "articles", 
    vectorDimension: 1024,
  },

  // Vectorization API configuration, choose an appropriate model
  embedding: {
    url: "vectorization-api-address",
    apiKey: "your-api-key", 
    model: "model-name", 
  },

  // Crawler configuration
  crawler: {
    url: "https://juejin.cn/hot/articles/1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};
```

## Usage

Start the crawler and store data in the Milvus database:

```bash
npm start
```

## System Flow

1. The crawler retrieves popular articles from the Juejin website
2. Article titles are converted to vectors via API
3. Article information and vectors are stored in the Milvus database
4. Semantic similarity queries can be performed through Milvus

## Project Structure

- `index.js` - Main program entry
- `crawl.js` - Juejin crawler implementation
- `milvus.js` - Milvus database operations wrapper
- `utils.js` - Utility functions, including vector conversion
- `config.js` - Configuration file template
- `config.local.js` - Local configuration file (needs to be created manually)

## Milvus Database Schema Design

The collection structure created in Milvus is as follows:

### Collection: articles

| Field Name | Data Type | Description | Other Features |
| ----- | ------- | ---- | ------- |
| id | Int64 | Primary Key ID | Auto-increment primary key |
| rank | Int64 | Article rank | Ranking order when crawled |
| title | VarChar | Article title | Maximum length 512 characters |
| title_vector | FloatVector | Title vector | Dimension 1024 |

### Index Configuration

An HNSW (Hierarchical Navigable Small World Graph) index was created on the `title_vector` field for efficient vector similarity search:

- Index type: HNSW
- Similarity metric: COSINE
- Parameter configuration:
  - M: 8 (number of neighbors for each node)
  - efConstruction: 64 (number of neighbors considered during index construction)

This index configuration is suitable for fast retrieval of similar articles, providing good performance while maintaining high query accuracy.

## Notes

- Ensure the configuration file contains the correct API keys and service addresses
- An available Milvus database service is required
- Crawler usage must comply with Juejin website's terms of use and crawler guidelines
- The vectorization API must have sufficient quota
