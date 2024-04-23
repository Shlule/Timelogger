<!-- eslint-disable unused-imports/no-unused-imports -->
<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import { useDateStore } from '~/stores/date'

// store the whole day of the week selected
const dateStore = useDateStore()
</script>

<template>
  <NDatePicker v-model:formatted-value="dateStore.dayFormated" panel type="date" :format="dateStore.dayFormat" />
</template>

<style scoped>

</style>
