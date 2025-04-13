import fetch from "node-fetch";

import { config } from "./config.local.js";

/**
 * transform text to vector
 * @param {string} text text to transform
 * @returns {Promise<Array<number>>} vector
 */
export async function textToVector(text) {
  const response = await fetch(config.embedding.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.embedding.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.embedding.model,
      input: text,
      encoding_format: "float",
    }),
  });
  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * log message
 * @param {string} message message to log
 */
export function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}
