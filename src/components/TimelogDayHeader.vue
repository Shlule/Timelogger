<script setup lang="ts">
const props = defineProps<{
  dayDate: string
}>()

const formatted = computed(() => props.dayDate.split(':'))
const dayName = computed(() => formatted.value[0])
const dayNumber = computed(() => formatted.value[1])
</script>

<template>
  <div m0 flex flex-1 flex-col items-center justify-center gap-2>
    <h2 text-xl>
      {{ dayName }}
    </h2>
    <h2 text-2xl font-bold>
      {{ dayNumber }}
    </h2>
  </div>
</template>

<style scoped>

</style>
