# ng-schematics-helpers

Angular Schematics helper functions

### Installation

```bash
npm install --save ng-schematics-helpers
```

### Usage

Import required helper function.

```typescript
import { findClassBySelector } from 'ng-schematics-helpers'
```

#### findClassBySelector

Search an class name by selector `findClassBySelector`

```typescript
findClassBySelector(selector: string, sourcePath: string, tree: Tree)
```

This will return:

```
{
  className: 'NavComponent',
  classPath: '/projects/pet-project/src/app/nav-component/nav.component.ts',
  modulePath: '/projects/pet-project/src/app/nav-component/nav.module.ts',
  moduleName: 'NavModule',
}
```

#### updateDeclarations

Update declarations inside selected module

```typescript
updateDeclarations({
  tree: Tree
  modulePathToEdit: string
  componentNameToInsert: string
  componentPathToInsert: string
})
```

#### updateImports

Update imports inside selected module

```typescript
updateImports({
  tree: Tree
  modulePathToEdit: string
  moduleNameToInsert: string
  modulePathToInsert: string
})
```

Check out docs or testing files for more information.

### License

Luis Reinoso [MIT License](LICENSE)
