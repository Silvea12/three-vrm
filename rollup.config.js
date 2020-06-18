/* eslint-env node */

import banner from 'rollup-plugin-banner';
import packageJson from './package.json';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

// == constants ====================================================================================
const copyright = '(c) 2020 pixiv Inc.';
const licenseName = 'MIT License';
const licenseUri = 'https://github.com/pixiv/three-vrm-constraints/blob/master/LICENSE';

// == envs =========================================================================================
const DEV = process.env.DEV === '1';
const SERVE = process.env.SERVE === '1';
const ESM = process.env.ESM === '1';

// == typescript ===================================================================================
const tsOptions = {
  target: ESM ? 'es6' : 'es5',
};

// == banner =======================================================================================
// uses `output.banner` in dev mode, since sourcemap matters
const bannerTextDev = `/*!
* ${packageJson.name} v${packageJson.version}
* ${packageJson.description}
*
* Copyright ${copyright}
* ${packageJson.name} is distributed under ${licenseName}
* ${licenseUri}
*/`;

// uses `rollup-plugin-banner` in prod mode, since terser removes the `output.banner` one
const bannerTextProd = `${copyright} - ${licenseUri}`;

// == serve ========================================================================================
const serveOptions = {
  contentBase: '.',
  port: 3001,
};

// == output =======================================================================================
export default {
  external: ['three'],
  input: 'src/index.ts',
  output: {
    format: ESM ? 'esm' : 'umd',
    name: ESM ? undefined : 'THREE_VRM_CONSTRAINTS',
    banner: DEV ? bannerTextDev : null,
    sourcemap: DEV ? 'inline' : false,
    globals: ESM ? {} : { three: 'THREE' },
  },
  plugins: [
    typescript(tsOptions),
    ...(DEV ? [] : [terser()]),
    ...(SERVE ? [serve(serveOptions)] : []),
    ...(DEV ? [] : [banner(bannerTextProd)]),
  ],
};
