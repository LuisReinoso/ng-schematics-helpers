import { Tree, SchematicsException } from '@angular-devkit/schematics'
import { buildRelativePath } from '@schematics/angular/utility/find-module'
import { addDeclarationToModule, addImportToModule } from '@schematics/angular/utility/ast-utils'
import { InsertChange } from '@schematics/angular/utility/change'
import { Context } from './models/context.model'
import * as ts from 'typescript'

export function createContext(
  tree: Tree,
  componentName: string,
  componentPath: string,
  modulePath: string
): Context {
  const moduleContent = tree.read(modulePath)?.toString('utf-8')

  if (!moduleContent) {
    throw new SchematicsException(`No module ${modulePath} doesn't exist`)
  }

  let result: Context = {
    classifiedName: componentName,
    relativePath: buildRelativePath(modulePath, componentPath),
    source: ts.createSourceFile(modulePath, moduleContent, ts.ScriptTarget.Latest, true),
  }

  return result
}

export function updateDeclarations({
  tree,
  modulePathToEdit,
  componentNameToInsert,
  componentPathToInsert,
}: {
  tree: Tree
  modulePathToEdit: string
  componentNameToInsert: string
  componentPathToInsert: string
}): void {
  const context = createContext(
    tree,
    componentNameToInsert,
    componentPathToInsert,
    modulePathToEdit
  )
  const declarationChanges = addDeclarationToModule(
    context.source,
    modulePathToEdit,
    context.classifiedName,
    context.relativePath
  )

  const moduleUpdateRecorder = tree.beginUpdate(modulePathToEdit)
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      moduleUpdateRecorder.insertLeft(change.pos, change.toAdd)
    }
  }
  tree.commitUpdate(moduleUpdateRecorder)
}

export function updateImports({
  tree,
  modulePathToEdit,
  moduleNameToInsert,
  modulePathToInsert,
}: {
  tree: Tree
  modulePathToEdit: string
  moduleNameToInsert: string
  modulePathToInsert: string
}): void {
  const context = createContext(tree, moduleNameToInsert, modulePathToInsert, modulePathToEdit)
  const declarationChanges = addImportToModule(
    context.source,
    modulePathToEdit,
    context.classifiedName,
    context.relativePath
  )

  const moduleUpdateRecorder = tree.beginUpdate(modulePathToEdit)
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      moduleUpdateRecorder.insertLeft(change.pos, change.toAdd)
    }
  }
  tree.commitUpdate(moduleUpdateRecorder)
}
