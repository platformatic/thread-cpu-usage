import { mkdir } from 'node:fs/promises'
import { arch, platform } from 'node:os'
import { resolve } from 'node:path'

console.log(`Current target: ${platform()}-${arch()}`)
await mkdir(resolve(process.cwd(), 'artifacts'), { recursive: true })
