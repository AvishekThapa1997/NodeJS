import { join, dirname } from "path";
import { fileURLToPath } from "url";
console.log(join(dirname(fileURLToPath(import.meta.url)), "index.html"));
const responseHandler = (req, res, next) => {
  res.sendFile(join(dirname(fileURLToPath(import.meta.url)), "index.html"));
};
export default responseHandler;
