<template>
    <div class="vue-contain" @click="onClick">
        {{ count }}
        <img src="./1.jpeg" />
        <img src="./2.svg" />
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const count = ref(1);

const onClick = () => {
    count.value ++;
}
</script>
<style scoped>
.vue-contain {
    height: 100px;
    width: 100px;
    background-color: blue;
}
</style>
