<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useAmap, type AmapInstance } from '../../src';

const amapRef = ref<AmapInstance>(null);

onMounted(() => {
  console.log('amapRef :>> ', amapRef.value);
});

const { amapInit, getAmap, amapStatus, amapStatusChange, whenAmapReady } =
  useAmap();

watchEffect(() => {
  console.log('amapStatus :>> ', amapStatus.value);
});

// ⚠️ You must wait until 'complete' (or other events triggered after the map is fully loaded) to get map and AMap
const { map, AMap } = getAmap();
if (map && AMap) {
  console.log('map :>> ', map);
  console.log('AMap :>> ', AMap);
}

const handleComplete = e => {
  const { map, AMap } = getAmap();
  if (!(map && AMap)) return;

  console.log('map :>> ', map);
  console.log('AMap :>> ', AMap);
};

const handleError = e => {};

// Test the edge case of operating the map before it is fully loaded
let marker;
const handleOperateMapBeforeLoadedMaybe = async () => {
  // whenAmapReady Usage 1
  // whenAmapReady(({ map, AMap }) => {
  //   if (!marker) {
  //     marker = new AMap.Marker({
  //       icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
  //       position: [116.406315, 39.908775],
  //       offset: new AMap.Pixel(-13, -30)
  //     });
  //     marker.setMap(map);
  //   }
  // });

  // whenAmapReady Usage 2
  const { map, AMap } = await whenAmapReady();
  if (!marker) {
    marker = new AMap.Marker({
      icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      position: [116.406315, 39.908775],
      offset: new AMap.Pixel(-13, -30)
    });
    marker.setMap(map);
  }
};

// Some business scenarios do not wait for the map to load before operating the map
handleOperateMapBeforeLoadedMaybe();
</script>

<template>
  <div class="amap-wrapper">
    <div class="amap-test-wrapper">
      <div>Amap status: {{ amapStatus }}</div>
      <!-- Control some buttons to be disabled before the map is fully loaded -->
      <button :disabled="amapStatus === 'loading'">
        disabled: {{ amapStatus === 'loading' }}
      </button>
    </div>
    <VAmap
      ref="amapRef"
      :map-options="{
        viewMode: '2D',
        zoom: 11,
        center: [116.397428, 39.90923]
      }"
      @init="amapInit"
      @status-change="amapStatusChange"
      @complete="handleComplete"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.amap-wrapper {
  width: 100%;
  height: 100%;
}
.amap-test-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 24px;
  color: black;
  font-weight: bold;
  z-index: 1;
}
</style>
