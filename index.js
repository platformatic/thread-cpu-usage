import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const native = require('./build/Release/thread-cpu-usage-native.node')

export const threadCpuUsage = native.threadCpuUsage
