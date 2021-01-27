import * as ts from "typescript";

export interface Context {
  source: ts.SourceFile;
  relativePath: string;
  classifiedName: string;
}
