<script setup lang="ts">
import { onMounted } from 'vue';
import { getQuickJS, shouldInterruptAfterDeadline  } from "quickjs-emscripten"

onMounted(() => {
  const contain: any = document.querySelector('#plugin-runtime-contain');

  const socket = new WebSocket('ws://127.0.0.1:5201/plugin');

  socket.addEventListener('message', function (event) {
    const data: any = JSON.parse(event.data);

    if (!data.name) return;

      if (data.name === 'ui') {
        console.log('ui');

        if (contain) {
          contain.src = window.URL.createObjectURL(new Blob([data.content], { type: 'text/html' }));
        }
      }
      if (data.name === 'core') {
        console.log('core', data.content);
        getQuickJS().then(QuickJS => {
          const res = QuickJS.evalCode(data.content, {
            shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
            memoryLimitBytes: 1024 * 1024,
          });

          console.log('quickJs执行结果：', res);
        });
      }
      if (data.name === 'manifest') {
        console.log('manifest');
      }
  });

  socket.addEventListener('open', function (event) {
    socket.send('connect');
  });

  socket.addEventListener('error', function (event) {
    console.log('WebSocket error: ', event);
  });
})
</script>

<template>
  <div class="plugin-runtime-page">
    <iframe id="plugin-runtime-contain" src=""></iframe>
  </div>
</template>

<style scoped>
#plugin-runtime-contain {
  height: 800px;
  width: 400px;
}
</style>
