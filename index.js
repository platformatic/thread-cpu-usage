import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { arch, platform } from 'node:os'
import { resolve } from 'node:path'

let addonPath = resolve(import.meta.dirname, './build/Release/thread-cpu-usage-native.node')

if (!existsSync(addonPath)) {
  const libc = existsSync('/etc/alpine-release') ? 'musl' : 'glibc'
  addonPath = resolve(import.meta.dirname, 'native', `${platform()}-${arch()}-${libc}.node`)
}

const require = createRequire(import.meta.url)
export const threadCpuUsage = require(addonPath).threadCpuUsage
