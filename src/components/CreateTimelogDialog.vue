<script setup lang="ts">
const props = defineProps<{
  selectedDay: string
  elementY: number

}>()

const taskKey = ref()
const timelogName = ref()

const timelogToCreate = useCreateTimelog({
  taskKey,
  timelogName,
  selectedDay: props.selectedDay,
  mouseCursorPosY: props.elementY,
})
const taskStore = useTaskStore()

const tasks = computed<TreeSelectOption[]>(() => {
  if (!taskStore.tasks)
    return []

  const tasksPerProject = new Map<string, Task[]>()

  taskStore.tasks.forEach((t) => {
    if (!tasksPerProject.has(t.projectName))
      tasksPerProject.set(t.projectName, [])

    tasksPerProject.get(t.projectName)?.push(t)
  })

  const options: TreeSelectOption[] = []
  tasksPerProject.forEach((tasks, project) => {
    options.push({
      key: project,
      label: project,
      disabled: true,
      children: tasks.map(t => ({
        key: t._key,
        label: `${t.projectName}/${t.name}`,
      })),
    })
  })
  return options
})
</script>

<template>
  <NDialog>
    <div flex="~ col" gap-2>
      <div flex="~ col" items-center gap-2 text-24px>
        <div>
          Job:
        </div>
        <NTreeSelect v-model:value="taskKey" :options="tasks" filterable clearable :default-expand-all="true" />
      </div>
      <div flex items-center>
        <div w-15>
          Title:
        </div>
        <NInput v-model:value="timelogName" text-center type="text" placeholder="Title" />
      </div>
      <NButton primary @click="timelogToCreate.createTimelog()">
        Create
      </NButton>
    </div>
  </NDialog>
</template>

<style scoped>

</style>
