<script setup lang="ts">
import { ref } from 'vue'

const my_number1 = ref(0)
const my_string = ref('hello')

// special type =====================================================================================

// accept string or number
const String_number = ref<string | number> (10)

// jvascript object
const name = ref<{ name: string }> ()

// array
const my_array = ref([])
const my_array2 = ref<number []> ([10])
const my_array3 = ref<string [] | number> (20)
const my_array4 = ref<{ name: string; type: string; id: number } []> ([])
</script>
