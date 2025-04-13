export const config = {
  // Milvus数据库配置
  milvus: {
    address: "192.168.31.166", // 替换为您的Milvus服务器地址
    port: "19530", // Milvus服务端口
    username: "",
    password: "",
    database: "juejin", // 数据库名称
    collection: "articles", // 集合名称
    vectorDimension: 1024, // 向量维度
  },

  // 向量化API配置
  embedding: {
    url: "https://api.siliconflow.cn/v1/embeddings",
    apiKey: "sk-kgahvlalrbfjyftxrciniliopeblhxsgrxebrwgiqwwxwxth", // 替换为您的API密钥
    model: "BAAI/bge-large-zh-v1.5", // 使用的模型
  },

  // 爬虫配置
  crawler: {
    url: "https://juejin.cn/hot/articles/1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};
