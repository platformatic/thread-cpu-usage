import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { arch, platform } from 'node:os'
import { resolve } from 'node:path'

const addonPath = resolve(
  import.meta.dirname,
  'native',
  `${platform()}-${arch()}-${existsSync('/etc/alpine-release') ? 'musl' : 'glibc'}.node`
)

const require = createRequire(import.meta.url)
export const threadCpuUsage = require(addonPath).threadCpuUsage
