import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/fix-imports'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-imports.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-imports.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'fixes wagmi v1 imports to v2'
)
