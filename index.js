import { JuejinCrawler } from "./crawl.js";
import { MilvusDB } from "./milvus.js";
import { textToVector, log } from "./utils.js";

async function main() {
  log("start to crawl juejin articles...");
  const crawler = new JuejinCrawler();
  const db = new MilvusDB();
  let milvusConnected = false;

  try {
    log("initialize milvus database...");
    await db.init();
    log("clearing existing collection...");
    await db.dropCollection();
    log("creating collection...");
    await db.createCollection();
    milvusConnected = true;
    log("milvus database connected");
  } catch (error) {
    log(`milvus database connection failed: ${error.message}, program end`);
    milvusConnected = false;
    return;
  }

  log("start to crawl juejin hot articles...");
  const articles = await crawler.crawlArticles();
  log(`crawled ${articles.length} articles`);

  if (articles.length === 0) {
    log("no articles crawled, program end");
    if (milvusConnected) {
      await closeMilvusConnection(db);
    }
    return;
  }

  log("start to process article data and generate vectors...");
  const vectors = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    try {
      log(`processing ${i + 1} / ${articles.length} article: ${article.title}`);
      const titleVector = await textToVector(article.title);
      const data = {
        rank: article.rank,
        title: article.title,
        title_vector: titleVector,
      };
      vectors.push(data);
    } catch (e) {
      log(
        `failed to process ${i + 1} / ${articles.length} article: ${e.message}`
      );
      continue;
    }
  }

  log(`vectors generated, successfully processed ${vectors.length} articles`);

  if (vectors.length > 0) {
    log("start to insert data into milvus database...");
    await db.insertData(vectors);
    log("database insertion completed");
  }

  if (milvusConnected) {
    await closeMilvusConnection(db);
  }

  log("program completed");
}

async function closeMilvusConnection(db) {
  log("start to close milvus database connection...");
  await db.close();
  log("milvus database connection closed");
}

main().catch((error) => {
  log(`program failed: ${error.message}`);
  process.exit(1);
});
