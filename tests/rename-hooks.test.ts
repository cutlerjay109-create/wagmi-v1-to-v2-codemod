import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/rename-hooks'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/rename-hooks.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/rename-hooks.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'renames wagmi v1 hooks to v2'
)
