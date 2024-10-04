import { getNativeTriplet } from '../lib/utils.js'

console.log(`Current target: ${getNativeTriplet().join('-')}`)
