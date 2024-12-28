import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'utils/midi-mapping.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    json()
  ],
  external: ['tone', '@tonejs/midi']
};

