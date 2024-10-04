import { createHash, randomBytes } from 'node:crypto'
import { once } from 'node:events'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { isMainThread, parentPort, threadId, Worker } from 'node:worker_threads'
import { threadCpuUsage } from '../../index.js'

function formatMs (ms) {
  return ms.toFixed(2)
}

function summarize () {
  const { user: processCpuUsageUser, system: processCpuUsageSystem } = process.cpuUsage()
  const { user: threadCpuUsageUser, system: threadCpuUsageSystem } = threadCpuUsage()

  console.log(
    JSON.stringify({
      thread: threadId,

      processCpuUsage: {
        user: formatMs(processCpuUsageUser / 1000),
        system: formatMs(processCpuUsageSystem / 1000)
      },
      threadCpuUsage: {
        user: formatMs(threadCpuUsageUser / 1000),
        system: formatMs(threadCpuUsageSystem / 1000)
      }
    })
  )
}

if (isMainThread) {
  const workers = []
  for (let i = 0; i < 3; i++) {
    workers.push(new Worker(fileURLToPath(import.meta.url)))
  }

  setTimeout(async () => {
    clearInterval(interval)

    for (const worker of workers) {
      worker.postMessage('clear')
    }

    await sleep(1000)

    summarize()

    for (const worker of workers) {
      worker.postMessage('exit')
      await once(worker, 'exit')
    }
  }, 5000)
} else {
  parentPort?.on('message', message => {
    if (message === 'clear') {
      clearInterval(interval)
      return
    }

    summarize()
    process.exit(0)
  })
}

const buffer = randomBytes(1e8)
const index = threadId + 1

const interval = setInterval(() => {
  const hrtime = process.hrtime.bigint()
  createHash('sha256').update(buffer).end(buffer)

  const elapsed = (Number(process.hrtime.bigint() - hrtime) / 1e6).toFixed(2)

  console.log(
    JSON.stringify({
      thread: threadId,
      elapsed
    })
  )
}, index * 100)
