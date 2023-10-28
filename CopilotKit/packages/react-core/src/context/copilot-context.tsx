"use client";

import { FunctionCallHandler } from "ai";
import React from "react";
import { TreeNodeId } from "../hooks/use-tree";
import { AnnotatedFunction } from "../types/annotated-function";
import { ChatCompletionCreateParams } from "openai/resources/chat";
import { DocumentPointer } from "../types";

export interface CopilotApiConfig {
  chatApiEndpoint: string;
}

export function copilotApiConfigExtrapolator(config: CopilotApiConfig) {
  return {
    get chatApiEndpoint(): string {
      return `${config.chatApiEndpoint}`;
    },
  };
}

export interface CopilotContextParams {
  // function-calling
  entryPoints: Record<string, AnnotatedFunction<any[]>>;
  setEntryPoint: (id: string, entryPoint: AnnotatedFunction<any[]>) => void;
  removeEntryPoint: (id: string) => void;
  getChatCompletionFunctionDescriptions: () => ChatCompletionCreateParams.Function[];
  getFunctionCallHandler: () => FunctionCallHandler;

  // text context
  getContextString: (categories?: string[]) => string;
  addContext: (
    context: string,
    parentId?: string,
    categories?: string[]
  ) => TreeNodeId;
  removeContext: (id: TreeNodeId) => void;

  // document context
  getDocumentsContext: (categories?: string[]) => DocumentPointer[];
  addDocumentContext: (
    documentPointer: DocumentPointer,
    categories?: string[]
  ) => TreeNodeId;
  removeDocumentContext: (documentId: string) => void;

  // api endpoints
  copilotApiConfig: CopilotApiConfig;
}

const emptyCopilotContext: CopilotContextParams = {
  entryPoints: {},
  setEntryPoint: () => {},
  removeEntryPoint: () => {},
  getChatCompletionFunctionDescriptions: () => returnAndThrowInDebug([]),
  getFunctionCallHandler: () => returnAndThrowInDebug(async () => {}),

  getContextString: () => returnAndThrowInDebug(""),
  addContext: () => "",
  removeContext: () => {},

  getDocumentsContext: () => returnAndThrowInDebug([]),
  addDocumentContext: () => returnAndThrowInDebug(""),
  removeDocumentContext: () => {},

  copilotApiConfig: new (class implements CopilotApiConfig {
    get chatApiEndpoint(): string {
      throw new Error(
        "Remember to wrap your app in a `<CopilotProvider> {...} </CopilotProvider>` !!!"
      );
    }
  })(),
};

export const CopilotContext =
  React.createContext<CopilotContextParams>(emptyCopilotContext);

function returnAndThrowInDebug<T>(value: T): T {
  throw new Error(
    "Remember to wrap your app in a `<CopilotProvider> {...} </CopilotProvider>` !!!"
  );
  return value;
}