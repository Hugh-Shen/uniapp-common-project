import { defineConfig } from 'vite'
import path from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import ENV_CONFIG from './envConfig'
import { replaceManifest } from './utils/replaceManifest.js'


// replaceManifest('mp-weixin.appid', ENV_CONFIG[process.env.UNI_CUSTOM_SCRIPT].VITE_APP_ID || '')

console.log('>>>', process.env.UNI_CUSTOM_SCRIPT)
export default defineConfig({
	resolve: {
	  alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	plugins: [uni()],
	define: {
	  'process.env.config': ENV_CONFIG,
	},
})

