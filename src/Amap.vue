<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { defaultOptions } from './defaultOptions';
import { sleep, toCssUnit } from './utils';
import type { Status, Map, AMap } from './types';

defineOptions({
  name: 'VAmap'
});

const props = withDefaults(
  defineProps<{
    uid?: string | number;
    width?: string | number;
    height?: string | number;
    loadOptions?: Parameters<typeof AMapLoader.load>[0];
    // TODO: Add TypeScript type hints later
    mapOptions?: Record<string, any>;
    // Whether to hide logo and copyright
    hideLogo?: boolean;
  }>(),
  {
    uid: +new Date(),
    // @ts-ignore
    width: () => defaultOptions.width,
    // @ts-ignore
    height: () => defaultOptions.height,
    // @ts-ignore
    loadOptions: () => ({}),
    mapOptions: () => ({}),
    // @ts-ignore
    hideLogo: () => defaultOptions.hideLogo
  }
);
const MAP_ID = `v-amap-${props.uid}`;

const status = ref<Status>('loading');

let map: Map | null = null;
let amap: AMap | null = null;

const width = computed(() => toCssUnit(props.width));
const height = computed(() => toCssUnit(props.height));

const emit = defineEmits<{
  init: [payload: { map: Map; AMap: AMap }];
  complete: [payload: { map: Map; AMap: AMap }];
  statusChange: [status: Status];
  error: [error: unknown];
}>();

const _init = async () => {
  try {
    status.value = 'loading';
    emit('statusChange', status.value);
    amap = await AMapLoader.load({
      ...defaultOptions.loadOptions,
      ...props.loadOptions
    });
    await sleep(3000);
    map = new amap!.Map(MAP_ID, {
      ...defaultOptions.mapOptions,
      ...props.mapOptions
    });
    emit('init', { map: map!, AMap: amap! });
    map!.on('complete', e => {
      status.value = 'complete';
      emit('statusChange', status.value);
      emit('complete', { map: map!, AMap: amap! });
    });
  } catch (error) {
    status.value = 'error';
    emit('statusChange', status.value);
    emit('error', error);
    console.error(`[VueAmap]: init error ${error}`);
  }
};
onMounted(_init);
onUnmounted(() => {
  map?.destroy();
  map = null;
});

defineExpose({
  status
});
</script>

<template>
  <div
    :id="MAP_ID"
    class="v-amap-container"
    :class="{ 'hide-logo': hideLogo }"
  />
</template>

<style scoped>
.v-amap-container {
  width: v-bind(width);
  height: v-bind(height);
}
.v-amap-container.hide-logo :deep(.amap-logo.amap-logo) {
  display: none !important;
  opacity: 0 !important;
}
.v-amap-container.hide-logo :deep(.amap-copyright.amap-copyright) {
  display: none !important;
  opacity: 0 !important;
}
</style>
