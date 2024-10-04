import { cp, glob, mkdir, rm } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'

const nativeDir = resolve(process.cwd(), 'native')

await rm(nativeDir, { force: true, recursive: true })
await mkdir(nativeDir, { recursive: true })

for await (const path of glob('/tmp/artifacts/**/*.node')) {
  const triplet = basename(dirname(path))
  await cp(path, resolve(nativeDir, `${triplet}.node`))
}
