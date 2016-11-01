import * as md5 from "md5";
import { IResolvedDependencyInfo } from "./strategies";

export function getBundleItemHash({ filePath, loaderOptions }: IResolvedDependencyInfo): string {
  return md5(filePath + ":" + JSON.stringify(loaderOptions || {}));
}