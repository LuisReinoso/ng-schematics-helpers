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
findClassBySelector(selector, sourcePath, tree);
```

This will return:

```
{
  className: 'NavComponent',
  classPath: '/projects/pet-project/src/nav-component/nav.component.ts'
}
```
Check out docs or testing files for more information.

### License

Luis Reinoso [MIT License](LICENSE)
