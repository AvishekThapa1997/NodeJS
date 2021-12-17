const fs = require("fs").promises;
const path = require("path");
const dirName = require("../util/path");
const dataSource = path.join(dirName, "data", "products.json");
const products = [];
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }
  async save() {
    let _products = [];
    try {
      const data = await getDataFromFile(dataSource);
      _products.push(...data);
    } catch (err) {}
    _products.push(this);
    products.push(..._products);
    await insertDataToFile(dataSource, products);
  }
  static async fetchAll() {
    try {
      return await getDataFromFile(dataSource);
    } catch (err) {
      return [];
    }
  }
};

const getDataFromFile = async (path) => {
  const bufferedData = await fs.readFile(path);
  const formattedData = bufferedData.toString("utf-8");
  return JSON.parse(formattedData);
};
const insertDataToFile = async (path, data) => {
  const formattedData = JSON.stringify(data);
  await fs.writeFile(path, formattedData);
};
