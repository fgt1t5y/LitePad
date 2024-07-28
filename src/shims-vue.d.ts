import { ComponentCustomOptions } from "vue";

declare module "vue" {
  interface ComponentCustomOptions {
    nw: typeof nw;
    isDesktop: boolean;
  }
}
