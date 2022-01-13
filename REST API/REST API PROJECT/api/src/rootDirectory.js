import { fileURLToPath } from "url";
import { dirname, join } from "path";
const filename = fileURLToPath(import.meta.url);
const rootDirName = dirname(join(filename, ".."));
export default rootDirName;
