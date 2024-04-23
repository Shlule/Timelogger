import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  rules: [
    ['custom-rule', { color: 'red' }],
  ],
  shortcuts: {
    'drag-el': 'bg-blue text-white p-4 m-2',
    'drop-zone': 'bg-gray-300 p-10px m-x-4 m-y-auto',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
