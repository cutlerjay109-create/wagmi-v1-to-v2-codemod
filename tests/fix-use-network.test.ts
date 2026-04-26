import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/fix-use-network'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-use-network.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-use-network.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'replaces useNetwork with useAccount and useConfig'
)
