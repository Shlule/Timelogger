<script setup lang="ts">
const dateStore = useDateStore()
</script>

<template>
  <div w-full flex flex-col overflow-auto>
    <div flex flex-justify-around>
      <TimelogDayHeader v-for="i in 7" :key="i - 1" :day-date="dateStore.week[i - 1]" />
    </div>
    <NScrollbar>
      <div relative top-10px z-100 h-full w-full flex>
        <div absolute h-full w-full flex>
          <TimelogDay v-for="i in 7" :key="i - 1" :day-date="dateStore.week[i - 1]" />
        </div>
      </div>
      <TimelogBackground />
      <!-- <div w-full flex flex-justify-around overflow-auto>
      <div w-full flex flex-1>
         <div z-100 w-full flex flex-col>
          </div>
        </div>
        <div w-full flex flex-justify-around>
          <TimelogDay v-for="i in 7" :key="i - 1" :day-date="dateStore.week[i - 1]" />
        </div>
      </div>

       </div> -->
    </NScrollbar>
  </div>
</template>

<style scoped>

</style>
