import { acceptHMRUpdate, defineStore } from 'pinia'

export interface Task {
  name: string
  _key: string
  projectName: string
}

export const useTaskStore = defineStore('task', () => {
  const aqApi = useAqAPIStore()
  const tasks = ref<Task[]>()

  watch(() => aqApi.me, async () => {
    tasks.value = await aqApi.aq.traverse(
      aqApi.me.user._key,
      {
        query: '# <($Assigned)- 0,50 ($Task AND $filter) SORT item.data.deadline DESC UNIQUE SET $set VIEW $view',
        aliases: {
          set: {
            projectPath: 'FIRST(# <($Child, 10)- 0,1 $Project AND LENGTH(path.vertices[* CURRENT.type == "Project"]) == 1 AND path.vertices[*].type NONE IN ["Organisation", "User"] SORT null VIEW path)',
          },
          filter: '((item.data.completion >= 0 AND item.data.completion < 1) OR item.data.completion == null) AND ((@now >= DATE_SUBTRACT(item.data.deadline, item.data.duration) OR DATE_SUBTRACT(item.data.deadline, item.data.duration) == null OR @now > item.data.startdate)) AND edge.data.isHidden != true AND (LENGTH(projectPath) == 0 OR LAST(projectPath.vertices).data.completion != -1)',
          view: {
            name: 'item.data.name',
            type: 'item.type',
            _key: 'item._key',
            status: 'item.data.status',
            color: 'item.data.color',
            duration: 'item.data.duration',
            deadline: 'item.data.deadline',
            completion: 'item.data.completion',
            parentKey: 'projectPath.vertices[1]._key',
            parentType: 'projectPath.vertices[1].type',
            parentName: 'projectPath.vertices[1].data.name',
            parentThumbnail: 'projectPath.vertices[1].data.thumbnail',
            location: 'CONCAT_SEPARATOR(" / ", REVERSE(projectPath.vertices[*].data.name))',
            edgeKey: 'edge._key',
            isHidden: 'edge.data.isHidden',
            projectName: 'projectPath.vertices[-1].data.name',
            retakes: '# -($Child, 2)> $Comment AND item.data.retaked == false SORT null VIEW item',
            timelogs: '# -($Child)> $Job SORT null VIEW item.data.duration',
            overdue: false,
            remainingProgression: 0,
          },
        },
      })
  })

  return {
    tasks,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
