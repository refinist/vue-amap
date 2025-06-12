import type { App, Component } from 'vue';
import type { DefaultOptions, WithInstall } from './types';
import { defaultOptions } from './defaultOptions';

export const sleep = (ms = 3000) =>
  new Promise(resolve => setTimeout(resolve, ms));

export function toCssUnit(value: string | number | undefined, unit = 'px') {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') return `${value}${unit}`;
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))
    return `${value}${unit}`;
  return value;
}

export function withInstall<T extends Component>(comp: T) {
  (comp as Record<string, unknown>).install = (
    app: App,
    options?: DefaultOptions
  ) => {
    const { name } = comp;
    if (name) {
      // override defaultOptions
      Object.assign(defaultOptions, options);
      app.component(name, comp);
    }
  };
  return comp as WithInstall<T>;
}
