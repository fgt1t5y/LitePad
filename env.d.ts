/// <reference types="vite/client" />
/// <reference types="nw.js" />

declare module '*.vue' {
  const component: ComponentOptions | ComponentOptions['setup'];
  export default component;
}
