import { existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { arch, platform } from 'node:os'
import { resolve } from 'node:path'

export const nativeDir = resolve(import.meta.dirname, '../native')

export function getNativeTriplet () {
  return [platform(), arch(), existsSync('/etc/alpine-release') ? 'musl' : 'glibc']
}

export function getNativeAddonPath () {
  return resolve(nativeDir, getNativeTriplet().join('-') + '.node')
}

export async function cleanNativeDirectory () {
  await rm(nativeDir, { force: true, recursive: true })
  await mkdir(nativeDir, { recursive: true })
}
