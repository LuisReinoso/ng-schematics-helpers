import { Tree } from '@angular-devkit/schematics'

export function findClassBySelector(
  selector: string,
  sourcePath: string,
  tree: Tree
): { className: string; classPath: string } | undefined {
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

  return { className, classPath: fileWithSelectorPath }
}

/*
  Read Workspaces
  https://github.com/angular/angular-cli/blob/efb97c87f023497dc59a2f4fa3825a2ca78606da/packages/ngtools/webpack/src/webpack-input-host.ts
  import { workspaces, virtualFs} from '@angular-devkit/core';
  virtualFs.createSyncHost();
  workspaces.createWorkspaceHost()
  workspaces.readWorkspace()
 */
