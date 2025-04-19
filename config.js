export const config = {
  // Milvus database config
  milvus: {
    address: "192.168.31.166", // replace with your milvus server address
    port: "19530", // milvus server port
    username: "",
    password: "",
    database: "juejin", // database name
    collection: "articles", // collection name
    vectorDimension: 1024, // vector dimension
  },

  // vectorization API config
  embedding: {
    url: "https://api.siliconflow.cn/v1/embeddings",
    apiKey: "api-key", // replace with your API key
    model: "BAAI/bge-large-zh-v1.5", // the model used
  },

  // crawler config
  crawler: {
    url: "https://juejin.cn/hot/articles/1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};
