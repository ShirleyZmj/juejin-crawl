import axios from "axios";
import { config } from "./config.local.js";

export class JuejinCrawler {
  constructor() {
    this.apiUrl =
      "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed";
    this.headers = {
      // "User-Agent": config.crawler.userAgent,
      // Accept: "application/json, text/plain, */*",
      // "Content-Type": "application/json",
      // Origin: "https://juejin.cn",
      // "Sec-Fetch-Site": "same-site",
      // "Sec-Fetch-Mode": "cors",
      // "Sec-Fetch-Dest": "empty",
      // Referer: "https://juejin.cn/",
      // "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "User-Agent": config.crawler.userAgent,
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: "https://juejin.cn",
      Referer: "https://juejin.cn/",
    };
  }

  async crawlArticles() {
    return await this.getArticlesFromAPI();
  }

  async getArticlesFromAPI() {
    try {
      const payload = {
        // client_type: 2608,
        // cursor: "0",
        // id_type: 2,
        // limit: 20,
        // sort_type: 3,
        // aid: 2608,
        // uuid: "7238994982991758885",
        // spider: 0,
        id_type: 2,
        sort_type: 3, // 热门
        cursor: "0",
        limit: 20,
      };
      // console.log("发送请求，payload:", payload);
      const response = await axios.post(this.apiUrl, payload, {
        headers: this.headers,
      });
      // console.log("API 响应状态:", response.status);
      // console.log("API 响应数据:", JSON.stringify(response.data, null, 2));
      const articles = [];
      const items = response.data.data;
      // console.log("找到的文章:", items);
      items?.forEach((item, index) => {
        if (
          item.item_type === 2 &&
          item.item_info &&
          item.item_info.article_info
        ) {
          const articleInfo = item.item_info.article_info;
          const {
            title,
            view_count,
            digg_count,
            hot_index,
            rank_index,
            brief_content,
          } = articleInfo;

          if (title) {
            articles.push({
              rank: index + 1,
              hotIndex: hot_index,
              rankIndex: rank_index,
              title: title,
              likes: digg_count,
              views: view_count,
              briefContent: brief_content,
              url: `https://juejin.cn/post/${articleInfo.article_id}`,
            });
          }
        }
      });
      console.log("找到的文章:", articles);
      return articles;
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }
}
