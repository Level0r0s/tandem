import { DependencyGraph } from "./dependency-graph";
import { FileCache } from "./file-cache";
import { FileEditor } from "./edit";
import { WebpackBundleStrategy } from "./dependency-graph";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";
import {
  DependencyGraphProvider,
  FileCacheProvider,
  FileSystemProvider,
  FileEditorProvider,
  DependencyGraphStratrgyProvider,
  FileResolverProvider,
} from "./providers";

export function createSandboxProviders(fileSystemClass?: { new(): IFileSystem }, fileResoverClass?: { new(): IFileResolver }) {
  return [
    new FileSystemProvider(fileSystemClass || (ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem)),
    new FileResolverProvider(fileResoverClass || (ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver)),
    new DependencyGraphStratrgyProvider("webpack", WebpackBundleStrategy),
    new FileCacheProvider(FileCache),
    new FileEditorProvider(FileEditor),
    new DependencyGraphProvider(DependencyGraph)
  ];
}