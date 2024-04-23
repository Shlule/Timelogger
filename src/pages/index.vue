<!-- eslint-disable unused-imports/no-unused-imports -->
<script setup lang="ts">
const test = useDateStore()
</script>

<template>
  <!-- <TimelogNew /> -->
  <!-- <TimelogDayNew :day-date="test.week[0]" /> -->
  <!-- <div>{{ test.week }} {{ test.dayParsed }}</div> -->
  <!-- <GeneralSettings /> -->
  <div flex flex-1 flex-col p4>
    <HeaderComponent p4 />
    <div flex flex-1 overflow-auto p4>
      <DatePicker h-fit />
      <TimelogWeek />
    </div>
  </div>
</template>

<style scoped>

</style>
