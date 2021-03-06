import * as React from "react";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticElement,
  PCVariant,
  DependencyGraph,
  InspectorNode,
  PCVariable
} from "paperclip";
import { FontFamily } from "../../../../../state";

export type Props = {
  visible: boolean;
  dispatch: Dispatch<any>;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticElement[];
  selectedVariant: PCVariant;
  fontFamilies: FontFamily[];
  globalVariables: PCVariable[];
  graph: DependencyGraph;
} & BaseStylesProps;

export default (Base: React.ComponentClass<BaseStylesProps>) =>
  class RightGutterController extends React.PureComponent<Props> {
    render() {
      const {
        visible,
        globalVariables,
        dispatch,
        syntheticDocument,
        selectedNodes,
        selectedVariant,
        fontFamilies,
        graph,
        selectedInspectorNodes,
        rootInspectorNode,
        ...rest
      } = this.props;
      if (!selectedNodes.length || !visible) {
        return null;
      }
      return (
        <Base
          variantsProps={{
            dispatch,
            syntheticDocument,
            selectedNodes,
            selectedVariant,
            graph
          }}
          prettyProps={{
            globalVariables,
            selectedVariant,
            dispatch,
            selectedInspectorNodes,
            rootInspectorNode,
            syntheticDocument,
            selectedNodes,
            graph,
            fontFamilies
          }}
          styleSwitcherProps={{
            dispatch,
            syntheticDocument,
            selectedNodes,
            graph,
            selectedVariant
          }}
          {...rest}
        />
      );
    }
  };
