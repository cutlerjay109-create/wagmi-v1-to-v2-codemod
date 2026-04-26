import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/fix-prepare-hooks'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-prepare-hooks.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-prepare-hooks.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'replaces prepare hooks with simulate and estimate'
)
