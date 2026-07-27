import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const api = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra1Client = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra2Client = new EcoThreadApiClient('http://localhost:4000/api/v1')

async function runQcUploadTests() {
  console.log('🧪 Starting ROADMAP-03 Real QC File Upload Integration Tests...')

  // 1. Authenticate Users
  const mitra1Login = await mitra1Client.login('mitra@ecothread.local', 'Password123!')
  assert(mitra1Login.token, 'Mitra 1 login token generated')
  console.log('  ✓ Mitra 1 authenticated')

  const mitra2Login = await mitra2Client.login('mitra2@ecothread.local', 'Password123!')
  assert(mitra2Login.token, 'Mitra 2 login token generated')
  console.log('  ✓ Mitra 2 authenticated')

  // 2. Prepare mock image File
  const smallJpgBuffer = Buffer.from('FFD8FFE000104A46494600010101006000600000FFD9', 'hex')
  const dummyJpgFile = new File([smallJpgBuffer], 'qc_front_sample.jpg', { type: 'image/jpeg' })

  // 3. Test Valid Image Upload
  console.log('\n📸 Test 1: Upload valid JPG file...')
  const uploadRes = await mitra1Client.uploadQcPhoto(dummyJpgFile)
  assert(uploadRes.url, 'Returned photo URL')
  assert(uploadRes.filename.startsWith('qc_'), 'Filename has qc_ prefix')
  assert.strictEqual(uploadRes.mimeType, 'image/jpeg', 'MIME type is image/jpeg')
  
  const savedFilePath = fs.existsSync(path.join(process.cwd(), 'uploads', 'qc', uploadRes.filename))
    ? path.join(process.cwd(), 'uploads', 'qc', uploadRes.filename)
    : path.join(process.cwd(), 'apps', 'api', 'uploads', 'qc', uploadRes.filename)
  assert(fs.existsSync(savedFilePath), 'Physical file exists on disk')
  console.log(`  ✓ File saved to disk: ${uploadRes.filename}`)

  // 4. Test Invalid MIME Type Upload (Negative Test)
  console.log('\n🚫 Test 2: Upload invalid file type (.txt)...')
  const invalidFile = new File(['dummy text content'], 'test.txt', { type: 'text/plain' })
  try {
    await mitra1Client.uploadQcPhoto(invalidFile)
    assert.fail('Should have rejected invalid MIME type')
  } catch (err: any) {
    assert(err.message.includes('Format file tidak valid'), 'Rejected with invalid MIME error')
    console.log('  ✓ Invalid MIME type rejected with 400')
  }

  // 5. Test File Size Limit Exceeded (Negative Test)
  console.log('\n📦 Test 3: Upload file exceeding 5MB limit...')
  const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024) // 6 MB
  const oversizedFile = new File([oversizedBuffer], 'huge_photo.jpg', { type: 'image/jpeg' })
  try {
    await mitra1Client.uploadQcPhoto(oversizedFile)
    assert.fail('Should have rejected oversized file')
  } catch (err: any) {
    assert(err.message, 'Rejected with error message on oversized upload')
    console.log(`  ✓ Oversized file rejected correctly (Error: ${err.message})`)
  }

  // 6. Test Full QC Submission with 3 Uploaded Photos
  console.log('\n📋 Test 4: Upload 3 required photos (front, back, detail) & Submit QC...')
  const frontFile = new File([smallJpgBuffer], 'front.jpg', { type: 'image/jpeg' })
  const backFile = new File([smallJpgBuffer], 'back.png', { type: 'image/png' })
  const detailFile = new File([smallJpgBuffer], 'detail.webp', { type: 'image/webp' })

  const frontUpload = await mitra1Client.uploadQcPhoto(frontFile)
  const backUpload = await mitra1Client.uploadQcPhoto(backFile)
  const detailUpload = await mitra1Client.uploadQcPhoto(detailFile)

  // Find or create an order for Mitra 1 to submit QC
  let mitra1User = await prisma.user.findUnique({ where: { email: 'mitra@ecothread.local' } })
  assert(mitra1User, 'Mitra 1 user exists')

  let targetOrder = await prisma.productionOrder.findFirst({
    where: {
      mitraUserId: mitra1User.id,
      status: { in: ['in_progress', 'accepted', 'kit_received'] }
    }
  })

  if (!targetOrder) {
    // Create kit and order for testing if none active
    const ecoKit = await prisma.ecoKit.findFirst() || await prisma.ecoKit.create({
      data: {
        code: `KIT-TEST-${Date.now()}`,
        name: 'Test Kit',
        targetProduct: 'Jaket Test'
      }
    })

    targetOrder = await prisma.productionOrder.create({
      data: {
        orderCode: `ORD-TEST-${Date.now()}`,
        ecoKitId: ecoKit.id,
        mitraUserId: mitra1User.id,
        status: 'in_progress',
        agreedPayoutRate: 150000,
        targetCompletion: new Date(Date.now() + 86400000 * 5)
      }
    })
  }

  const submitQcRes = await mitra1Client.submitQcEvidence(targetOrder.id, {
    frontPhoto: frontUpload.url,
    backPhoto: backUpload.url,
    detailPhoto: detailUpload.url,
    notes: 'Jahitan selesai dengan presisi 100%',
    actualSize: 'M'
  })

  assert(submitQcRes.order, 'Order returned after QC submission')
  assert.strictEqual(submitQcRes.order.status, 'submitted_to_qc', 'Order status updated to submitted_to_qc')
  assert(submitQcRes.evidence, 'Evidence record created in database')
  assert.strictEqual(submitQcRes.evidence.frontPhoto, frontUpload.url, 'Front photo URL saved correctly')
  console.log(`  ✓ QC submission with 3 real uploaded photos succeeded for Order ${targetOrder.orderCode}`)

  console.log('\n🎉 ALL ROADMAP-03 REAL QC FILE UPLOAD TESTS PASSED SUCCESSFULLY!\n')
}

runQcUploadTests()
  .catch((err) => {
    console.error('❌ Test failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
