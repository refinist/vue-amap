import { withInstall } from './utils';

import _Amap from './Amap.vue';

export const Amap = withInstall(_Amap);

export default Amap;

export * from './useAmap';

export type * from './types';

declare module 'vue' {
  export interface GlobalComponents {
    VAmap: typeof Amap;
  }
}
