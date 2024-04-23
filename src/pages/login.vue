<script setup lang="ts">
import { useNotification } from 'naive-ui'

const router = useRouter()

const isDark = useDark()
const aquariumStore = useAqAPIStore()
const notification = useNotification()

interface LoginInfo {
  email: string
  password: string
}

const loginInfo = ref<LoginInfo>({
  email: '',
  password: '',
})

function toggleDark() {
  isDark.value = !isDark.value
}

async function onLogin() {
  // await aquariumStore
  //   .signIn(loginInfo.value)
  //   .catch(error => notification.error({
  //     content: 'Error',
  //     meta: error.message,
  //     duration: 4000,
  //   }))
  try {
    await aquariumStore.signIn(loginInfo.value)
    notification.success({
      content: 'Login successful',
      duration: 2500,
    })
    router.push('/')
  }
  catch (error: any) {
    notification.error({
      content: 'Error',
      meta: error.message,
      duration: 4000,
    })
  }
}
</script>

<template>
  <NButton @click="toggleDark">
    Toggle dark
  </NButton>

  <div m-auto max-w-120 w-full flex items-center justify-center p-10>
    <div w-full flex flex-col gap-2>
      <h1 text-center text-3xl text-sky-500>
        Login
      </h1>
      <NSpace />
      <NInput
        v-model:value="loginInfo.email"
        type="text"
        placeholder="Aquarium Email"
      />
      <NInput
        v-model:value="loginInfo.password"
        placeholder="Aquarium Password"
        type="password"
        show-password-on="click"
      />
      <NCheckbox label="Remember password" />
      <NButton
        :disabled="!loginInfo.email || !loginInfo.password"
        type="primary"
        color="#0ea5e9"
        @click="onLogin"
      >
        Login
      </NButton>
    </div>
  </div>
</template>

<style scoped>

</style>
