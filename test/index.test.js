import { deepEqual, ok, throws } from 'node:assert'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { threadCpuUsage } from '../index.js'

function validateResult (result) {
  ok(result !== null)
  ok(Number.isFinite(parseInt(result.user)))
  ok(Number.isFinite(parseInt(result.system)))
  ok(result.user >= 0)
  ok(result.system >= 0)
}

test('it should give proper thread usage', async () => {
  const { stdout } = spawnSync('node', [fileURLToPath(new URL('./fixtures/load.js', import.meta.url))])

  const lines = stdout
    .toString()
    .trim()
    .split('\n')
    .filter(line => line.startsWith('{') && line.endsWith('}'))
    .map(l => JSON.parse(l))

  deepEqual(lines[0].thread, 0)
  deepEqual(lines[1].thread, 1)
  deepEqual(lines[2].thread, 2)
  deepEqual(lines[3].thread, 3)

  for (const line of lines) {
    validateResult(line.processCpuUsage)
    validateResult(line.threadCpuUsage)
  }
})

test('it works on the main thread, with or without arguments', () => {
  const result = threadCpuUsage()

  validateResult(result)
  validateResult(threadCpuUsage())
  validateResult(threadCpuUsage(result))

  let previous = threadCpuUsage()
  for (let i = 0; i < 10; i++) {
    const current = threadCpuUsage()

    validateResult(current)
    ok(current.user >= previous.user)
    ok(current.system >= previous.system)
    previous = current
  }
})

test('it complains for invalid arguments', async () => {
  for (const arg of [123, [], { user: -123 }, { system: 'bar' }]) {
    throws(
      () => threadCpuUsage(arg),
      /threadCpuUsage only accepts an optional object containing the user and system values as positive numbers/
    )
  }
})
