import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/fix-tanstack-query'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-tanstack-query.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-tanstack-query.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'moves tanstack query params into query object'
)
