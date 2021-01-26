import { findClassBySelector } from '../src/find-class-by-selector'
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'
import * as path from 'path'

const collectionPath = path.join(__dirname, './collection.json')

describe('find class info by selector', () => {
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

  it('it should return className given selector', () => {
    const classInfo = findClassBySelector('app-nav', sourcePath, tree)
    expect(classInfo).toEqual({
      className: 'AppNavComponent',
      classPath: `${sourcePath}/app/app-nav/app-nav.component.ts`,
      modulePath: undefined,
    })
  })

  it('it should return undefined given not exist selector', () => {
    const classInfo = findClassBySelector('app-menu', sourcePath, tree)
    expect(classInfo).toBeUndefined()
  })
})

describe('find class info by selector contain module', () => {
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
        { path: `${sourcePath}/app/testing`, name: 'app-nav', export: true },
        tree
      )
      .toPromise()
  })

  it('it should return className given selector', () => {
    const classInfo = findClassBySelector('app-nav', sourcePath, tree)
    expect(classInfo).toEqual({
      className: 'AppNavComponent',
      classPath: `${sourcePath}/app/testing/app-nav/app-nav.component.ts`,
      modulePath: `${sourcePath}/app/testing/testing.module.ts`,
      moduleName: 'TestingModule',
    })
  })

  it('it should return undefined given not exist selector', () => {
    const classInfo = findClassBySelector('app-menu', sourcePath, tree)
    expect(classInfo).toBeUndefined()
  })
})
