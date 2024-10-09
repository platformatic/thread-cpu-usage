import { cp, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cleanNativeDirectory, getNativeAddonPath } from './helper.js'

try {
  await cleanNativeDirectory()
} catch (e) {
  // This can fail on Docker, and it is okay
}

await cp(resolve(import.meta.dirname, '../build/Release/thread-cpu-usage-native.node'), getNativeAddonPath())
await rm(resolve(import.meta.dirname, '../build'), { recursive: true, force: true })
