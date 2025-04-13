import { JuejinCrawler } from "./crawl.js";

async function main() {
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

main();
