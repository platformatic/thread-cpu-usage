import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'node:path'

const packageJsonPath = resolve(import.meta.dirname, '../package.json')
const version = process.argv[2].replace(/^v/, '')

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
packageJson.version = version
await writeFile('package.json', JSON.stringify(packageJson, null, 2), 'utf-8')
