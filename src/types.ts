import type AMapLoader from '@amap/amap-jsapi-loader';
import type Amap from './Amap.vue';
import type { App } from 'vue';

export type Map = Record<string, any>;

export type AMap = Record<string, any>;

export type Instance = {
  map: Map;
  AMap: AMap;
};

export type Status = 'loading' | 'error' | 'complete';

export type DefaultOptions = {
  width?: string | number;
  height?: string | number;
  loadOptions?: Parameters<typeof AMapLoader.load>[0];
  mapOptions?: Record<string, any>;
  hideLogo?: boolean;
};

export type AmapInstance = InstanceType<typeof Amap> | null;

export type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

export type WithInstall<T> = T & {
  install: (app: App, options?: DefaultOptions) => void;
} & EventShim;
