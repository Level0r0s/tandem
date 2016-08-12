
import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { dependency as rootComponentDependency } from "./components/root";

// commponent tools
import { dependency as selectableToolComponentDependency } from "./components/selectable-tool";
import { dependency as selectorToolComponentDependency } from "./components/selector-tool";
import { dependency as gridToolComponentDependency } from "./components/grid-tool";
import { dependency as dragSelectComponentDependency } from "./components/drag-select-tool";

// services
import { dependency as clipboardService } from "./services/clipboard";
import { dependency as editorServiceDependency } from "./services/editor";
import { dependency as backEndServiceDependency } from "./services/back-end";
import { dependency as selectorServiceDependency } from "./services/selector";
import { dependency as keyBindingsServiceDependency } from "./services/key-binding";
import { dependency as rootComponentRendererDependency } from "./services/root-component-renderer";
import { dependency as workspaceDependency } from "./services/workspace";

// tools
import { dependency as pointerToolDependency } from "./tools/pointer";

// key bindings
import { dependency as keyBindingsDependency } from "./key-bindings";

// extensions
import { dependency as htmlExtensionDependency } from "sf-html-extension";

// selections
import { displayEntitySelectionDependency } from "./models";

import { Workspace } from "./models";

export class FrontEndApplication extends Application {

  public workspace: Workspace;

  protected registerDependencies() {
    super.registerDependencies();

    // this is primarily for testing
    if (this.config.registerFrontEndDependencies === false) return;

    this.dependencies.register(

      // components
      rootComponentDependency,

      // component tools
      selectableToolComponentDependency,
      selectorToolComponentDependency,
      gridToolComponentDependency,
      dragSelectComponentDependency,

      // services
      clipboardService,
      editorServiceDependency,
      backEndServiceDependency,
      selectorServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,
      workspaceDependency,

      // tools
      pointerToolDependency,

      // selection
      displayEntitySelectionDependency,

      // dependencies
      keyBindingsDependency,

      // extensions
      htmlExtensionDependency
    );
  }
}