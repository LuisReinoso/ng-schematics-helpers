import { Tree } from '@angular-devkit/schematics'

export function findClassBySelector(
  selector: string,
  sourcePath: string,
  tree: Tree
): { className: string; classPath: string; modulePath: string; moduleName: string } | undefined {
  let srcDir = tree.getDir(sourcePath)
  let dirsToVisit = srcDir.subdirs.map((dirName) => srcDir.path + '/' + dirName)

  const selectorRegex = new RegExp("'" + selector + "'", 'g')
  let fileWithSelectorPath = null

  while (dirsToVisit.length > 0 || fileWithSelectorPath === null) {
    const subDir = dirsToVisit.pop()

    if (!subDir) {
      return
    }

    let subDirToVisit = tree.getDir(subDir)

    const typescriptFiles = subDirToVisit.subfiles.filter((p) => p.endsWith('ts'))

    const fileWithSelectorName = typescriptFiles.find((fileName) => {
      const fileContent = tree.read(`${subDirToVisit.path}/${fileName}`)
      if (!fileContent) {
        return
      }
      const hasFileSelector = selectorRegex.test(fileContent.toString())
      return hasFileSelector
    })

    if (fileWithSelectorName) {
      fileWithSelectorPath = `${subDirToVisit.path}/${fileWithSelectorName}`
    } else {
      subDirToVisit.subdirs
        .map((dirName) => subDirToVisit.path + '/' + dirName)
        .forEach((dirPath) => dirsToVisit.push(dirPath))
    }
  }

  const classNameRegex = /class\s([a-zA-Z$_]\w*[Component|Page])/
  const className = tree.read(`${fileWithSelectorPath}`)?.toString().match(classNameRegex)?.[1]

  if (!className) {
    return
  }

  let moduleExportRegex = new RegExp('exports:[.\\s\\S]*(' + className + ')[.\\s\\S]*]', '')
  const moduleNameRegex = /class\s([a-zA-Z$_]\w*[Module])/
  let modulePath = undefined
  let moduleName = undefined

  let dirModulePath = tree.getDir(fileWithSelectorPath.split('/').slice(0, -1).join('/'))

  while ((dirModulePath && dirModulePath.path !== null) || (!modulePath && dirModulePath)) {
    let dir = dirModulePath

    const posibleModuleFiles = dir.subfiles.filter((fileName) => fileName.includes('module.ts'))
    if (posibleModuleFiles.length > 0) {
      posibleModuleFiles.forEach((possibleModuleFile) => {
        const hasExport = moduleExportRegex.test(
          tree.read(`${dir.path}/${possibleModuleFile}`)?.toString()
        )

        if (hasExport) {
          modulePath = `${dir.path}/${possibleModuleFile}`
          moduleName = tree
            .read(`${dir.path}/${possibleModuleFile}`)
            ?.toString()
            .match(moduleNameRegex)?.[1]
        }
      })
    }
    dirModulePath = dirModulePath.parent
  }

  return { className, classPath: fileWithSelectorPath, modulePath, moduleName }
}

/*
  Read Workspaces
  https://github.com/angular/angular-cli/blob/efb97c87f023497dc59a2f4fa3825a2ca78606da/packages/ngtools/webpack/src/webpack-input-host.ts
  import { workspaces, virtualFs} from '@angular-devkit/core';
  virtualFs.createSyncHost();
  workspaces.createWorkspaceHost()
  workspaces.readWorkspace()
 */
