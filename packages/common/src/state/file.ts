import {
  TreeNode,
  getChildParentMap,
  filterNestedNodes,
  getTreeNodeFromPath,
  findNestedNode,
  updateNestedNode,
  createTreeNode,
  appendChildNode
} from "./tree";
import { memoize } from "../utils/memoization";
import * as path from "path";
import { generateUID } from "../utils/uid";
import { addProtocol, FILE_PROTOCOL } from "../utils/protocol";
import { arraySplice, EMPTY_ARRAY } from "..";

export enum FSItemNamespaces {
  CORE = "core"
}

export enum FSItemTagNames {
  FILE = "file",
  DIRECTORY = "directory"
}

type BaseFSItem<TName extends string> = {
  uri: string;
  expanded?: boolean;
  selected?: boolean;
} & TreeNode<TName>;

export type File = BaseFSItem<FSItemTagNames.FILE>;

export type Directory = BaseFSItem<FSItemTagNames.DIRECTORY>;

export enum FileAttributeNames {
  URI = "uri",
  EXPANDED = "expanded",
  BASENAME = "basename",
  SELECTED = "selected"
}

export type FSItem = File | Directory;

export const isFile = (node: any): node is File =>
  node.name === FSItemTagNames.FILE;
export const isDirectory = (node: TreeNode<any>) =>
  node.name === FSItemTagNames.DIRECTORY;

export const createFile = (uri: string): File => ({
  id: generateUID(),
  name: FSItemTagNames.FILE,
  uri,
  children: []
});

export const createDirectory = (
  uri: string,
  children: FSItem[] = []
): Directory => ({
  id: generateUID(),
  name: FSItemTagNames.DIRECTORY,
  uri,
  children: children || []
});

const getFileName = (current: FSItem) => path.basename(current.uri);

export const getFilePath = memoize((file: File, directory: Directory) => {
  const childParentMap = getChildParentMap(directory);
  const path: string[] = [];

  let current: FSItem = file;
  while (current) {
    path.unshift(getFileName(current));
    current = childParentMap[current.id] as FSItem;
  }

  return path.join("/");
});

export const getFilePathFromNodePath = (path: number[], directory: Directory) =>
  getFilePath(getTreeNodeFromPath(path, directory) as File, directory);

export const getFileFromUri = (uri: string, root: Directory) =>
  findNestedNode(root, child => child.uri === uri);

export const getFilesWithExtension = memoize(
  (extension: string, directory: Directory) => {
    const tester = new RegExp(`${extension}$`);
    return filterNestedNodes(
      directory,
      file => isFile(file) && tester.test(getFileName(file))
    );
  }
);

type FilePathPair = [string, boolean];

export const convertFlatFilesToNested = (files: FilePathPair[]): FSItem[] => {
  const splitParts = files.map(([filePath, isDirectory]) => {
    return [filePath.split("/"), isDirectory];
  }) as [string[], boolean][];

  const sortedFiles = splitParts
    .sort((a, b) => {
      const [ap, aid] = a;
      const [bp, bid] = b;

      if (ap.length > bp.length) {
        return -1;
      } else if (ap.length < bp.length) {
        return 1;
      }

      // same length, just check if it's a directory
      return aid ? 1 : -1;
    })
    .map(([parts, isDirectory]) => {
      return [parts.join("/"), isDirectory];
    }) as FilePathPair[];

  const pool = {};

  let highest: FSItem;
  let highestDirname: string;

  for (const [filePath, isDirectory] of sortedFiles) {
    const uri = addProtocol(FILE_PROTOCOL, filePath);
    if (isDirectory) {
      highest = createDirectory(uri, sortFSItems(pool[uri] || EMPTY_ARRAY));
    } else {
      highest = createFile(uri);
    }

    highestDirname = path.dirname(uri);

    if (!pool[highestDirname]) {
      pool[highestDirname] = [];
    }

    pool[highestDirname].push(highest);
  }

  return sortFSItems(pool[highestDirname]);
};

export const sortFSItems = (files: FSItem[]) =>
  [...files].sort((a, b) => {
    return a.name === FSItemTagNames.FILE && b.name === FSItemTagNames.DIRECTORY
      ? 1
      : a.name === FSItemTagNames.DIRECTORY && b.name === FSItemTagNames.FILE
        ? -1
        : a.uri < b.uri
          ? -1
          : 1;
  });
