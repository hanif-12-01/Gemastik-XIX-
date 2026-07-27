import { isValidOrderTransition } from '../src/index.js'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('🧪 Running State Machine & Validation Unit Tests...')

// Test valid transitions
assert(isValidOrderTransition('draft', 'offered') === true, 'draft -> offered should be valid')
assert(isValidOrderTransition('offered', 'accepted') === true, 'offered -> accepted should be valid')
assert(isValidOrderTransition('accepted', 'in_progress') === true, 'accepted -> in_progress should be valid')
assert(isValidOrderTransition('in_progress', 'submitted_to_qc') === true, 'in_progress -> submitted_to_qc should be valid')
assert(isValidOrderTransition('submitted_to_qc', 'qc_approved') === true, 'submitted_to_qc -> qc_approved should be valid')
assert(isValidOrderTransition('qc_approved', 'paid') === true, 'qc_approved -> paid should be valid')

// Test invalid transitions
assert(isValidOrderTransition('draft', 'completed') === false, 'draft -> completed should be INVALID')
assert(isValidOrderTransition('submitted_to_qc', 'paid') === false, 'submitted_to_qc -> paid should be INVALID')
assert(isValidOrderTransition('completed', 'draft') === false, 'completed -> draft should be INVALID')

console.log('✅ All State Machine Unit Tests PASSED!')
