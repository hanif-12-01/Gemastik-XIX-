import { execSync } from 'child_process'

function run(cmd: string) {
  console.log('\n▶ Executing:', cmd)
  execSync(cmd, { stdio: 'inherit', cwd: 'd:/LOMBA/GEMASTIK' })
}

try {
  console.log('🚀 STARTING ECOTHREAD MVP RELEASE-CANDIDATE VERIFICATION SUITE...')
  run('pnpm prisma validate')
  run('pnpm --filter @ecothread/contracts build')
  run('pnpm --filter @ecothread/api-client build')
  run('pnpm --filter @ecothread/api typecheck')
  run('pnpm --filter @ecothread/api build')
  run('pnpm --filter @ecothread/web typecheck')
  run('pnpm --filter @ecothread/web build')
  run('pnpm build')
  console.log('\n✅ ALL MONOREPO BUILD & TYPECHECK CHECKS PASSED 100%!')
} catch (e: any) {
  console.error('\n❌ RELEASE CHECK FAILED:', e.message)
  process.exit(1)
}
