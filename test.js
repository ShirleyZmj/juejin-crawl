import { JuejinCrawler } from "./crawl.js";
import { textToVector } from "./utils.js";

async function main() {
  testEmbedding();
}

async function testCrawl() {
  const crawler = new JuejinCrawler();
  try {
    const articles = await crawler.crawlArticles();
    console.log("articles crawled", articles);
    articles?.forEach((article) => {
      console.log(`${article.rank}. ${article.title}`);
    });
  } catch (error) {
    console.error("crawl error", error);
  }
}

async function testEmbedding() {
  try {
    const vector = await textToVector("你好");
    console.log(vector);
  } catch (error) {
    console.error("embedding error", error);
  }
}

main();
