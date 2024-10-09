import { cp, glob } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { cleanNativeDirectory, nativeDir } from './helper.js'

await cleanNativeDirectory()

for await (const path of glob('/tmp/artifacts/**/*.node')) {
  const triplet = basename(dirname(path))
  await cp(path, resolve(nativeDir, `${triplet}.node`))
}
