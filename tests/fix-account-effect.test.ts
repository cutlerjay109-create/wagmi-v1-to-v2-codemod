import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../transforms/fix-account-effect'
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-account-effect.input.ts'),
  'utf8'
)

const output = fs.readFileSync(
  path.join(__dirname, '../__testfixtures__/fix-account-effect.output.ts'),
  'utf8'
)

defineInlineTest(
  transform,
  { parser: 'tsx' },
  input,
  output,
  'moves onConnect and onDisconnect into useAccountEffect'
)
