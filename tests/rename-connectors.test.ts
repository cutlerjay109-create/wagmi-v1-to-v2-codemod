import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/rename-connectors'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/rename-connectors.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/rename-connectors.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'renames wagmi v1 connectors to v2'
)
