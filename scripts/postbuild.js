import { cp, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cleanNativeDirectory, getNativeAddonPath } from './helper.js'

await cleanNativeDirectory()
await cp(resolve(import.meta.dirname, '../build/Release/thread-cpu-usage-native.node'), getNativeAddonPath())
await rm(resolve(import.meta.dirname, '../build'), { recursive: true, force: true })
