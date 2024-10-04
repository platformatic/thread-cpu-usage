import { createRequire } from 'node:module'
import { getNativeAddonPath } from './lib/utils.js'

const require = createRequire(import.meta.url)
export const threadCpuUsage = require(getNativeAddonPath()).threadCpuUsage
