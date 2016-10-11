import * as ts from "typescript";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { CommonJSSandboxModule } from "@tandem/javascript-extension";

export class TSJSModule extends CommonJSSandboxModule {
  transpile() {
    return ts.transpile(this.content, {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React
    }, this.fileName);
  }
}

