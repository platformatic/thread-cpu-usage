import { deepEqual, ok, throws } from 'node:assert'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { threadCpuUsage } from '../index.js'

test('it should give proper thread usage', async () => {
  const { stdout } = spawnSync('node', [fileURLToPath(new URL('./fixtures/load.js', import.meta.url))])

  const lines = stdout
    .toString()
    .trim()
    .split('\n')
    .map(l => JSON.parse(l))

  deepEqual(lines[0].thread, 0)
  deepEqual(lines[1].thread, 1)
  deepEqual(lines[2].thread, 2)
  deepEqual(lines[3].thread, 3)

  for (let i = 0; i < 3; i++) {
    const processDifference = lines[i].processCpuUsage.user / lines[i + 1].processCpuUsage.user
    const threadDifference = lines[i].threadCpuUsage.user / lines[i + 1].threadCpuUsage.user

    /*
      All CPU usages should be the same. Technically they should have returned the same
      value but since we measure it at different times they vary a little bit.
    */
    ok(processDifference > 0.95)
    ok(processDifference < 1.05)

    /*
      Each thread is designed to have a utilization two times the other one.
      But since we cant really predict the OS scheduling, we just request it to be more than 33%.
    */
    ok(threadDifference > 1.3)
  }
})

test('it works on the main thread, with or without arguments', () => {
  threadCpuUsage(threadCpuUsage())
})

test('it complains for invalid arguments', async () => {
  for (const arg of [123, [], { user: -123 }, { system: 'bar' }]) {
    throws(
      () => threadCpuUsage(arg),
      /threadCpuUsage only accepts an optional object containing the user and system values as positive numbers/
    )
  }
})
