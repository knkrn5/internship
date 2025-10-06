import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

// Enable ts-node ESM for this project root
register('ts-node/esm', pathToFileURL('./'))