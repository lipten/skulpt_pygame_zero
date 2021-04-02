// External libs
// These will have to remain until we (or someone else) writes
// proper .d.ts definition files for them.
declare let template:any;
// node's typings definitions currently break stuff, use this instead
declare let DEBUG:any;
interface NodeRequire {
  ensure:(paths:string[], callback:(require:<T>(path:string) => T) => void, name?:string ) => void;
}

declare interface Window {
  PyGameZero: any;
  PIXI: any;
  $builtinmodule: any;
  Sk: any;
  TWEEN: any;
}

// declare module '*.scss' {
//   const content:any;
//   // eslint-disable-next-line import/no-default-export
//   export default content;
// }
