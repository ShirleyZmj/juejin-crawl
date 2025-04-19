import { JuejinCrawler } from "./crawl.js";
import { MilvusDB } from "./milvus.js";
import { textToVector, log } from "./utils.js";

async function main() {
  log("开始爬取掘金文章...");
  const crawler = new JuejinCrawler();
  const db = new MilvusDB();
  let milvusConnected = false;

  try {
    log("初始化 Milvus 数据库...");
    await db.init();
    log("正在清空现有集合...");
    await db.dropCollection();
    log("正在创建集合...");
    await db.createCollection();
    milvusConnected = true;
    log("Milvus 数据库连接成功");
  } catch (error) {
    log(`Milvus 数据库连接失败: ${error.message}, 程序结束`);
    milvusConnected = false;
    return;
  }

  log("开始爬取掘金热门文章...");
  const articles = await crawler.crawlArticles();
  log(`爬取到 ${articles.length} 篇文章`);

  if (articles.length === 0) {
    log("没有爬取到任何文章, 程序结束");
    if (milvusConnected) {
      await closeMilvusConnection(db);
    }
    return;
  }

  log("开始处理文章数据和生成向量...");
  const vectors = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    try {
      log(`正在处理第 ${i + 1} / ${articles.length} 篇文章: ${article.title}`);
      const titleVector = await textToVector(article.title);
      const data = {
        rank: article.rank,
        title: article.title,
        title_vector: titleVector,
        url: article.url,
        likes: article.likes,
        views: article.views,
        briefContent: article.briefContent,
      };
      vectors.push(data);
    } catch (e) {
      log(`处理第 ${i + 1} / ${articles.length} 篇文章失败: ${e.message}`);
      continue;
    }
  }

  log(`向量生成完成, 共成功处理 ${vectors.length} 篇文章`);

  if (vectors.length > 0) {
    log("开始将数据插入 Milvus 数据库...");
    await db.insertData(vectors);
    log("数据库插入完成");
  }

  if (milvusConnected) {
    await closeMilvusConnection(db);
  }

  log("程序执行完成");
}

async function closeMilvusConnection(db) {
  log("开始关闭 Milvus 数据库连接...");
  await db.close();
  log("Milvus 数据库连接关闭完成");
}

main().catch((error) => {
  log(`程序执行失败: ${error.message}`);
  process.exit(1);
});
