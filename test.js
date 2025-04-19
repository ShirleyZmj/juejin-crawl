import { JuejinCrawler } from "./crawl.js";
import { textToVector } from "./utils.js";

async function main() {
  testCrawl();
}

async function testCrawl() {
  const crawler = new JuejinCrawler();
  try {
    const articles = await crawler.crawlArticles();
    console.log("爬取到的文章：");
    articles?.forEach((article) => {
      console.log(`${article.rank}. ${article.title}`);
    });
  } catch (error) {
    console.error("爬取失败：", error);
  }
}

async function testEmbedding() {
  try {
    const vector = await textToVector("你好");
    console.log(vector);
  } catch (error) {
    console.error("向量化失败：", error);
  }
}

main();
