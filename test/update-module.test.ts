import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'
import { updateDeclarations, updateImports } from '../src/update-module'
import { join } from 'path'

const collectionPath = join(__dirname, './collection.json')

describe('Update module declarations', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath)
  const projectRootName = 'projects'
  const projectName = 'find-class-by-selector'
  const sourcePath = `/${projectRootName}/${projectName}/src`

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: projectRootName,
    version: '1',
  }
  const appOptions = {
    name: projectName,
  }

  let tree: UnitTestTree

  beforeEach(async () => {
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise()
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise()
    tree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'component',
        { path: `${sourcePath}/app`, name: 'app-nav', skipImport: true },
        tree
      )
      .toPromise()
  })

  it('it should update app.module declarations', () => {
    updateDeclarations({
      tree,
      modulePathToEdit: '/projects/find-class-by-selector/src/app/app.module.ts',
      componentNameToInsert: 'AppNavComponent',
      componentPathToInsert: '/projects/find-class-by-selector/src/app/app-nav/app-nav.component.html'
    })
    expect(tree.readContent('/projects/find-class-by-selector/src/app/app.module.ts')).toContain(
      'AppNavComponent'
    )
  })
})

describe('Update module imports', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath)
  const projectRootName = 'projects'
  const projectName = 'find-class-by-selector'
  const sourcePath = `/${projectRootName}/${projectName}/src`

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: projectRootName,
    version: '1',
  }
  const appOptions = {
    name: projectName,
  }

  let tree: UnitTestTree

  beforeEach(async () => {
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise()
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise()
    tree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'module',
        { name: 'testing', path: `${sourcePath}/app` },
        tree
      )
      .toPromise()
    tree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'component',
        { path: `${sourcePath}/app/testing`, name: 'app-nav', skipImport: true },
        tree
      )
      .toPromise()
  })

  it('should update app.module imports', () => {
    updateImports({
      tree,
      modulePathToEdit: '/projects/find-class-by-selector/src/app/app.module.ts',
      moduleNameToInsert: 'TestingModule',
      modulePathToInsert: '/projects/find-class-by-selector/src/app/testing/testing.module.ts',
    })
    expect(tree.readContent('/projects/find-class-by-selector/src/app/app.module.ts')).toContain(
      'TestingModule'
    )
  })
})
