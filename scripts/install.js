import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { existsSync } from 'node:fs'
import { platform } from 'node:os'
import { getNativeAddonPath } from './helper.js'

const addonPath = getNativeAddonPath()

if (process.env.npm_config_build_from_source === 'true' || !existsSync(addonPath)) {
  const subprocess =
    platform() === 'win32'
      ? spawn('npm run build', { shell: true, windowsVerbatimArguments: true, stdio: 'inherit' })
      : spawn('npm', ['run', 'build'], { stdio: 'inherit' })

  const [code] = await once(subprocess, 'exit')

  if (code !== 0) {
    console.error(`Building from source failed with error code ${code}.`)
    process.exit(code)
  }
}
