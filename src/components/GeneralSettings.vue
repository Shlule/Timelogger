<script setup lang="ts">
import { NMenu } from 'naive-ui'

const options = [{
  label: 'hello',
  key: 'hello t',
}]
</script>

<template>
  <div>
    <NMenu :indent="24" :options=" options" />
  </div>
</template>

<style scoped>

</style>
