import { ref, shallowRef, watch } from 'vue';
import type { Map, AMap, Status, Instance } from './types';

export const useAmap = () => {
  const status = ref<Status>('loading');
  const instance = shallowRef<{
    AMap: AMap | null;
    map: Map | null;
  }>({
    AMap: null,
    map: null
  });

  const init = (e: Instance) => {
    instance.value = e;
  };
  const statusChange = (p: Status) => {
    status.value = p;
  };
  const get = () => {
    return instance.value;
  };

  // Ensure operations are performed after the map is ready.
  // Can be executed independently of handleComplete to accommodate more business scenarios.
  const whenAMapReady = (
    cb?: (instance: Instance) => void
  ): Promise<Instance> => {
    let resolve!: (value: Instance) => void;
    const p = new Promise<Instance>(_ => (resolve = _));

    const { map, AMap } = get();
    if (map && AMap) {
      const obj = { map, AMap };
      cb?.(obj);
      resolve(obj);
    } else {
      // ❌ Do not use status for listening to avoid the failure of listening caused by not
      // assigning amapStatusChange in the business.
      // const unwatch = watch(status, val => {
      //   if (val === 'complete') {
      //     const { map, AMap } = get();
      //     if (map && AMap) {
      //       const obj = { map, AMap };
      //       cb?.(obj);
      //       resolve(obj);
      //       unwatch();
      //     }
      //   }
      // });

      // ✅
      const unwatch = watch(instance, val => {
        const { map, AMap } = val;
        if (map && AMap) {
          const obj = { map, AMap };
          cb?.(obj);
          resolve(obj);

          unwatch();
        }
      });
    }
    return p;
  };

  return {
    amapInit: init,
    amapStatusChange: statusChange,
    getAmap: get,
    amapStatus: status,
    whenAMapReady
  };
};
