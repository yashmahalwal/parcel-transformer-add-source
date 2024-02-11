# parcel-transformer-add-source

A [Parcel](https://parceljs.org/) transformer to add source code to your assets. It is handy for creating documentations. It gives you complete freedom of how to add and export source code from your assets.

## Installation

You can install the plugin via npm:

```bash
npm install parcel-transformer-add-source-code --save-dev
```

Or using yarn:

```bash
yarn add parcel-transformer-add-source-code --dev
```

## Usage

The plugin can be added to parcel configuration. It also needs its own configuration file which describes how to add the source code to the assets.

### Add plugin to parcel configuration
Add the plugin to your `.parcelrc` file. A few things to keep in mind here:

1. The plugin should be in correct order in the list of transformers. Since each transformer can update your asset, this plugin should process the asset at appropriate step of transformation process. You usually want it to be the first transformer loaded as that allows your to get the original source code of your asset.

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "**/CodeSamples/**/*.{js,jsx}": ["@yashmahalwal/parcel-transformer-add-source", "..."]
  }
}
```
2. The plugin should not run for a large number of files since it has a performance overhead. Select the target files carefully to avoid unnecessary slow downs in your development builds. Above example targets `.js` and `.jsx` files in folders named `CodeSamples` across the project. 

### Specify how to add source code to asset 
Add a configuration file named `transformer-add-source.config.js`. This should export an `addSourceCode` function. This function provides the source and encoded version of your asset's code. By default, source code is encoded to `base64`. The function should return updated asset code. You can use it to control how your source code is exposed from the asset.

```js
module.exports = {
  addSourceCode(source, encodedSource) {
    return `${source}\nexport const __sourceCode="${encodedSource}"`;
  },
};
```

In the above example, the plugin adds `base64` encoding of source code as an exported variable named `__sourceCode`. For example:
```js
// @/Docs/Button
import {Component, __sourceCode} from '@/CodeSamples/Button';

const sourceCode = window.atob(__sourceCode)

export default function ButtonDocumentation(){
  return <section>
    <h2>Button Example</h2>
    <Component />
    <article>
      <h3>Source code</h3>
      <code>{sourceCode}</code>
    </article>
  </section>
}
```

That's it. You can run your development server and see your documentation.

## Configuration options

Configuration is a JS file. It exposes the following options:

```ts
export type Config = {
  encode?(sourceCode: string): string;
  addSourceCode(fileSourceCode: string, encodedSourceCode: string): string;
}
```

### [Required] `addSourceCode`
Function to provide the updated code of asset with source code injected. It accepts `fileSourceCode` and `encodedSourceCode` in parameters. By default `base64` encoding is used.

### [Optional] `encode`
If you wish to change the encoding from `base64` to something of your preference, you can do it in this function. It accepts `sourceCode` and returns the encoded code.

## Usage with typescript
The plugin can also be used along with typescript. 

### Transforming typescript files
Make sure that your `.parcelrc` uses the plugin for your typescript files. That can be done by targetting `.ts` and `.tsx` extensions. 

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "**/CodeSamples/**/*.{ts,tsx}": ["@yashmahalwal/parcel-transformer-add-source", "..."]
  }
}
```

### Typings for configuration
Configuration file must be a Javascript file. However you can add IDE support by using typings exported with the package.

```js
const { base64Encode } = require("@yashmahalwal/parcel-transformer-add-source/build/base64-encode");

/**
 *
 * @type {import("@yashmahalwal/parcel-transformer-add-source/build/types/config").Config}
 */
module.exports = {
  addSourceCode(source, encodedSource) {
    return `${source}\nexport const __sourceCode="${encodedSource}"`;
  },
  encode(sourceCode) {
    return base64Encode(sourceCode)
  },
};

```

### Adding declaration for your assets
You can augment your asset modules to add typings for your exposed source code. For example,
```
├── src
│   ├── CodeSamples
│   │   ├── Button
│   │   │   ├── Button.tsx
│   │   │   ├── index.ts 
```

You can use `index.ts` to augment typings to `Button.tsx` module. 

```tsx
// Button.tsx
export default function Button(){
  return <button />
}
```

```tsx
// index.ts
export { default, __sourceCode as SourceCode } from "./Button";

declare module "./Button" {
  export const __sourceCode: string;
}
```

Now you can import `sourceCode` from `@/CodeSamples/Button/index.tsx`. This can also be a chance to decode source code as a part of your import tunnel.

## Development

In order to make changes to the plugin, edit the files under `src`. Once you are done with your changes, also update the tests.

### Testing
Parcel does not expose testing utilities. Therefore, we have a test project fixture which is built with parcel and the CLI tests are used to assert on output under different configurations of the plugin.

For more information, check out `bats` [documentation](https://bats-core.readthedocs.io/en/stable/writing-tests.html)

#### Running tests
1. Run `npm install` in the repository folder. Or if you use yarn, run `yarn install`.
2. Run `npm test`. Or if you use yarn, run `yarn test`

Here's what happens while running the test script:

1. `pretest` script runs to use [yalc](https://github.com/wclr/yalc) to build and publish the package to a local registry. It then links the plugin to `test/project` and then installs other dependencies for `test/project`.
2. `test` script invokes `bats` to run tests from `test/bats.test`. This file contains tests against `test/project` folder. It builds the project with different configurations, asserts on output and then cleans up the build.
3. Once `test` script runs, `posttest` script unlinks the plugin package and unpublishes it from local registry. 

## Examples
[Documentation](https://yashmahalwal.github.io/react-synced-state/) for [`react-synced-state`](https://github.com/yashmahalwal/react-synced-state)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
