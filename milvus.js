import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
import { config } from "./config.local.js";

export class MilvusDB {
  constructor() {
    this.client = new MilvusClient({
      address: `${config.milvus.address}:${config.milvus.port}`,
      username: config.milvus.username,
      password: config.milvus.password,
    });
    this.database = config.milvus.database;
    this.collection = config.milvus.collection;
    this.dimension = config.milvus.vectorDimension;
  }

  async init() {
    await this.createDatabase();
    await this.useDatabase();
  }

  async useDatabase() {
    try {
      await this.client.use({ db_name: this.database });
    } catch (error) {
      console.error("use database error", error);
      throw error;
    }
  }

  /**
   * to create a database
   */
  async createDatabase() {
    try {
      await this.client.createDatabase({
        db_name: this.database,
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return;
      }
      console.error("create database error", error);
      throw error;
    }
  }

  /**
   * to check if the collection exists
   * @returns boolean
   */
  async hasCollection() {
    const response = await this.client.hasCollection({
      collection_name: this.collection,
    });
    return response.value === true;
  }

  /**
   * to create a collection
   */
  async createCollection() {
    const fields = [
      {
        name: "id",
        data_type: DataType.Int64,
        is_primary_key: true,
        autoID: true,
      },
      {
        name: "rank",
        data_type: DataType.Int64,
        description: "rank of article",
      },
      {
        name: "title",
        data_type: DataType.VarChar,
        max_length: 512,
        description: "title of article",
      },
      {
        name: "title_vector",
        data_type: DataType.FloatVector,
        dim: this.dimension,
        description: "title vector",
      },
    ];

    await this.client.createCollection({
      collection_name: this.collection,
      fields,
    });

    await this.client.createIndex({
      collection_name: this.collection,
      field_name: "title_vector",
      index_type: "HNSW", // HNSW is the type of index based on graph
      metric_type: "COSINE", // COSINE is the metric type of cosine similarity
      params: {
        // index parameters
        M: 8, // the number of neighbors of each node
        efConstruction: 64, // the number of neighbors considered when building the index
      },
    });

    // load collection, ensure the index is built, and load from disk to memory
    await this.client.loadCollection({
      collection_name: this.collection,
    });
  }

  /**
   * to insert data into the collection
   * @param {Array} data
   */
  async insertData(data) {
    if (!data || !data.length) {
      return;
    }

    const processedData = data.map((item) => {
      return {
        rank: item.rank,
        title: item.title,
        title_vector: item.title_vector,
      };
    });

    const insertData = {
      collection_name: this.collection,
      fields_data: processedData,
    };

    await this.client.insert(insertData);
  }

  /**
   * to drop a collection
   */
  async dropCollection() {
    const exists = await this.hasCollection();

    if (!exists) {
      return;
    }

    await this.client.dropCollection({
      collection_name: this.collection,
    });
  }

  /**
   * to close the connection
   */
  async close() {
    if (!this.client) {
      return;
    }
    await this.client.closeConnection();
  }
}
