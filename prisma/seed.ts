import { PrismaClient, Role, DataOrigin, ProductionOrderStatus, PayoutStatus, DppVerificationState } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting EcoThread Database Seed...')

  // 1. Hash demo password asynchronously once with cost factor 10
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10)

  // 2. Seed Mandatory Users (Admin, Mitra 1, Mitra 2, Customer User)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecothread.local' },
    update: {
      name: 'Super Admin EcoThread',
      role: Role.admin,
      passwordHash: defaultPasswordHash,
      userProfile: {
        upsert: {
          create: {
            phone: '+6281234567890',
            address: 'City Hub Bandung, Jawa Barat',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          },
          update: {
            phone: '+6281234567890',
            address: 'City Hub Bandung, Jawa Barat',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          }
        }
      }
    },
    create: {
      email: 'admin@ecothread.local',
      passwordHash: defaultPasswordHash,
      role: Role.admin,
      name: 'Super Admin EcoThread',
      dataOrigin: DataOrigin.demo,
      userProfile: {
        create: {
          phone: '+6281234567890',
          address: 'City Hub Bandung, Jawa Barat',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        }
      }
    }
  })

  const mitraUser = await prisma.user.upsert({
    where: { email: 'mitra@ecothread.local' },
    update: {
      name: 'Ibu Ratna (Mitra Penjahit Bandung)',
      role: Role.mitra,
      passwordHash: defaultPasswordHash,
      userProfile: {
        upsert: {
          create: {
            phone: '+6289876543210',
            address: 'Kec. Bojongsoang, Kab. Bandung',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
          },
          update: {
            phone: '+6289876543210',
            address: 'Kec. Bojongsoang, Kab. Bandung',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
          }
        }
      },
      mitraProfile: {
        upsert: {
          create: {
            workshopName: 'Mitra Ratna Jahit Sederhana',
            specialization: 'Upcycled Denim & Outerwear',
            capacityPerWeek: 15,
            location: 'Bandung',
            rating: 4.9,
            totalPaidOut: 450000.0,
            bankAccountInfo: 'BCA 8901234567 a.n Ratna',
            isVerified: true,
            verificationStatus: 'approved',
            dataOrigin: DataOrigin.demo
          },
          update: {
            workshopName: 'Mitra Ratna Jahit Sederhana',
            specialization: 'Upcycled Denim & Outerwear',
            capacityPerWeek: 15,
            location: 'Bandung',
            rating: 4.9,
            totalPaidOut: 450000.0,
            bankAccountInfo: 'BCA 8901234567 a.n Ratna',
            isVerified: true,
            verificationStatus: 'approved',
            dataOrigin: DataOrigin.demo
          }
        }
      }
    },
    create: {
      email: 'mitra@ecothread.local',
      passwordHash: defaultPasswordHash,
      role: Role.mitra,
      name: 'Ibu Ratna (Mitra Penjahit Bandung)',
      dataOrigin: DataOrigin.demo,
      userProfile: {
        create: {
          phone: '+6289876543210',
          address: 'Kec. Bojongsoang, Kab. Bandung',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
        }
      },
      mitraProfile: {
        create: {
          workshopName: 'Mitra Ratna Jahit Sederhana',
          specialization: 'Upcycled Denim & Outerwear',
          capacityPerWeek: 15,
          location: 'Bandung',
          rating: 4.9,
          totalPaidOut: 450000.0,
          bankAccountInfo: 'BCA 8901234567 a.n Ratna',
          isVerified: true,
          verificationStatus: 'approved',
          dataOrigin: DataOrigin.demo
        }
      }
    }
  })

  const mitra2User = await prisma.user.upsert({
    where: { email: 'mitra2@ecothread.local' },
    update: {
      name: 'Pak Ahmad (Mitra Penjahit Surabaya)',
      role: Role.mitra,
      passwordHash: defaultPasswordHash,
      userProfile: {
        upsert: {
          create: {
            phone: '+6289876543211',
            address: 'Kec. Sukolilo, Surabaya, Jawa Timur',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
          },
          update: {
            phone: '+6289876543211',
            address: 'Kec. Sukolilo, Surabaya, Jawa Timur',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
          }
        }
      },
      mitraProfile: {
        upsert: {
          create: {
            workshopName: 'Mitra Ahmad Tailor',
            specialization: 'Upcycled Shirts & Patchwork',
            capacityPerWeek: 20,
            location: 'Surabaya',
            rating: 4.8,
            totalPaidOut: 0.0,
            bankAccountInfo: 'Mandiri 1234567890 a.n Ahmad',
            isVerified: true,
            verificationStatus: 'approved',
            dataOrigin: DataOrigin.demo
          },
          update: {
            workshopName: 'Mitra Ahmad Tailor',
            specialization: 'Upcycled Shirts & Patchwork',
            capacityPerWeek: 20,
            location: 'Surabaya',
            rating: 4.8,
            totalPaidOut: 0.0,
            bankAccountInfo: 'Mandiri 1234567890 a.n Ahmad',
            isVerified: true,
            verificationStatus: 'approved',
            dataOrigin: DataOrigin.demo
          }
        }
      }
    },
    create: {
      email: 'mitra2@ecothread.local',
      passwordHash: defaultPasswordHash,
      role: Role.mitra,
      name: 'Pak Ahmad (Mitra Penjahit Surabaya)',
      dataOrigin: DataOrigin.demo,
      userProfile: {
        create: {
          phone: '+6289876543211',
          address: 'Kec. Sukolilo, Surabaya, Jawa Timur',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
        }
      },
      mitraProfile: {
        create: {
          workshopName: 'Mitra Ahmad Tailor',
          specialization: 'Upcycled Shirts & Patchwork',
          capacityPerWeek: 20,
          location: 'Surabaya',
          rating: 4.8,
          totalPaidOut: 0.0,
          bankAccountInfo: 'Mandiri 1234567890 a.n Ahmad',
          isVerified: true,
          verificationStatus: 'approved',
          dataOrigin: DataOrigin.demo
        }
      }
    }
  })

  // Pending Mitra Seed Account for Verification Testing
  const pendingMitraUser = await prisma.user.upsert({
    where: { email: 'mitra_pending@ecothread.local' },
    update: {
      name: 'Bapak Budi (Mitra Penjahit Semarang)',
      role: Role.mitra,
      passwordHash: defaultPasswordHash,
      mitraProfile: {
        upsert: {
          create: {
            workshopName: 'Konveksi Budi Mandiri',
            specialization: 'Pakaian Anak Upcycle',
            capacityPerWeek: 12,
            location: 'Semarang',
            isVerified: false,
            verificationStatus: 'pending_verification',
            dataOrigin: DataOrigin.demo
          },
          update: {
            workshopName: 'Konveksi Budi Mandiri',
            specialization: 'Pakaian Anak Upcycle',
            capacityPerWeek: 12,
            location: 'Semarang',
            isVerified: false,
            verificationStatus: 'pending_verification',
            dataOrigin: DataOrigin.demo
          }
        }
      }
    },
    create: {
      email: 'mitra_pending@ecothread.local',
      passwordHash: defaultPasswordHash,
      role: Role.mitra,
      name: 'Bapak Budi (Mitra Penjahit Semarang)',
      dataOrigin: DataOrigin.demo,
      mitraProfile: {
        create: {
          workshopName: 'Konveksi Budi Mandiri',
          specialization: 'Pakaian Anak Upcycle',
          capacityPerWeek: 12,
          location: 'Semarang',
          isVerified: false,
          verificationStatus: 'pending_verification',
          dataOrigin: DataOrigin.demo
        }
      }
    }
  })

  const customerUser = await prisma.user.upsert({
    where: { email: 'user@ecothread.local' },
    update: {
      name: 'Budi Eco Consumer',
      role: Role.user,
      passwordHash: defaultPasswordHash,
      userProfile: {
        upsert: {
          create: {
            phone: '+628111222333',
            address: 'Jl. Dago No. 45, Bandung',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
          },
          update: {
            phone: '+628111222333',
            address: 'Jl. Dago No. 45, Bandung',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
          }
        }
      }
    },
    create: {
      email: 'user@ecothread.local',
      passwordHash: defaultPasswordHash,
      role: Role.user,
      name: 'Budi Eco Consumer',
      dataOrigin: DataOrigin.demo,
      userProfile: {
        create: {
          phone: '+628111222333',
          address: 'Jl. Dago No. 45, Bandung',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
        }
      }
    }
  })

  console.log('✅ Seed Users Created:')
  console.log('   - Admin:    admin@ecothread.local')
  console.log('   - Mitra 1:  mitra@ecothread.local')
  console.log('   - Mitra 2:  mitra2@ecothread.local')
  console.log('   - User:     user@ecothread.local')

  // 3. Seed Material Source & Batch
  const source = await prisma.materialSource.upsert({
    where: { sourceCode: 'SRC-BDG-001' },
    update: {},
    create: {
      sourceCode: 'SRC-BDG-001',
      name: 'Bank Sampah Tekstil Majalaya',
      category: 'Limbah Garmen Pre-Consumer',
      location: 'Majalaya, Bandung',
      dataOrigin: DataOrigin.demo
    }
  })

  const batch = await prisma.materialBatch.upsert({
    where: { batchCode: 'MAT-2026-0001' },
    update: {},
    create: {
      batchCode: 'MAT-2026-0001',
      sourceId: source.id,
      materialType: 'Denim Potongan Industri & Flannel Sisa',
      weightKg: 25.5,
      color: 'Indigo Blue & Red Checkered',
      sortingDetails: 'Limbah kelas A, tidak berserabut, warna 90% cerah',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      sanitizationDate: new Date(),
      status: 'ready_for_kit',
      dataOrigin: DataOrigin.demo,
      sanitizationRecords: {
        create: {
          method: 'Steam Sterilization & Eco-Wash',
          temperatureC: 95.0,
          operator: 'Petugas Sterilisasi Hub',
          notes: 'Lolos uji bebas kuman & bau'
        }
      }
    }
  })

  // 4. Seed Pattern
  const pattern = await prisma.pattern.upsert({
    where: { patternCode: 'PAT-2026-0001' },
    update: {},
    create: {
      patternCode: 'PAT-2026-0001',
      name: 'Jaket Patchwork Eco-Kimono',
      category: 'Outerwear',
      description: 'Pola jaket kimono sirkular dengan teknik penyambungan perca denim.',
      dataOrigin: DataOrigin.demo,
      versions: {
        create: {
          versionCode: 'v1.0',
          instructions: '1. Potong panel denim 10x10cm\n2. Sambung dengan benang katun daur ulang\n3. Pasang furing lembut',
          isApproved: true
        }
      }
    }
  })

  // 5. Seed Eco-Kit
  const ecoKit = await prisma.ecoKit.upsert({
    where: { kitCode: 'KIT-2026-0001' },
    update: {},
    create: {
      kitCode: 'KIT-2026-0001',
      patternId: pattern.id,
      name: 'Paket Produksi Jaket Kimono Denim (Ukuran L)',
      difficulty: 'Medium',
      targetHours: 6.0,
      status: 'ready',
      dataOrigin: DataOrigin.demo,
      ecoKitItems: {
        create: {
          batchId: batch.id,
          quantity: 1.8,
          unit: 'kg',
          itemNotes: 'Potongan kain denim steril & benang jahit'
        }
      }
    }
  })

  // 6. Seed Production Order
  const order = await prisma.productionOrder.upsert({
    where: { orderCode: 'ORD-2026-0001' },
    update: {
      mitraUserId: mitraUser.id
    },
    create: {
      orderCode: 'ORD-2026-0001',
      ecoKitId: ecoKit.id,
      mitraUserId: mitraUser.id,
      status: ProductionOrderStatus.qc_approved,
      agreedPayoutRate: 175000.0,
      targetCompletion: new Date(Date.now() + 86400000 * 3),
      dataOrigin: DataOrigin.demo,
      productionProgress: {
        create: [
          { stepName: 'Penerimaan Eco-Kit', percentage: 20.0, notes: 'Bahan lengkap' },
          { stepName: 'Pemotongan & Pemetaan Perca', percentage: 50.0, notes: 'Proses jahit panel' },
          { stepName: 'Finishing Jaket', percentage: 100.0, notes: 'Selesai disetrika' }
        ]
      },
      productionEvidence: {
        create: {
          frontPhoto: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
          backPhoto: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=600',
          detailPhoto: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
          notes: 'Kualitas jahitan rapi, presisi sesuai panduan ukuran L',
          actualSize: 'L'
        }
      },
      qcReviews: {
        create: {
          adminUserId: adminUser.id,
          isApproved: true,
          decisionNotes: 'QC Lolos. Jahitan rapi, ukuran presisi, kebersihan sempurna.',
          checkFront: true,
          checkBack: true,
          checkStitching: true,
          checkMeasures: true
        }
      },
      payouts: {
        create: {
          amount: 175000.0,
          status: PayoutStatus.paid,
          paymentReference: 'PAY-BCA-20260727-009',
          paidAt: new Date(),
          dataOrigin: DataOrigin.demo
        }
      }
    }
  })

  // 7. Seed Product & Dynamic DPP
  // Rule 8: Do not create fake impact records. Ensure demo impact records are empty.
  await prisma.impactRecord.deleteMany({
    where: { dataOrigin: DataOrigin.demo }
  })

  const dppBaseUrl = (process.env.DPP_PUBLIC_BASE_URL || process.env.DPP_BASE_URL || process.env.VITE_DPP_BASE_URL || 'http://localhost:5175').replace(/\/$/, '')
  const productCode = 'PRD-2026-0001'

  const product = await prisma.product.upsert({
    where: { productCode },
    update: {},
    create: {
      productCode,
      productionOrderId: order.id,
      name: 'Upcycled Denim Eco-Kimono Jacket (Special Edition)',
      description: 'Jaket Kimono eksklusif berbahan 100% denim sisa industri, dibuat oleh mitra penjahit lokal Ibu Ratna.',
      size: 'L',
      category: 'Outerwear',
      beforeImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      afterImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      status: 'published',
      isPublishedDpp: true,
      dataOrigin: DataOrigin.demo,
      productMaterials: {
        create: {
          batchId: batch.id,
          weightKg: 1.8
        }
      },
      dppRecord: {
        create: {
          productCode,
          verificationState: DppVerificationState.database_verified,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${dppBaseUrl}/dpp/${productCode}`,
          dataOrigin: DataOrigin.demo,
          dppVersions: {
            create: {
              versionNum: 1,
              payloadJson: JSON.stringify({
                productCode,
                productName: 'Upcycled Denim Eco-Kimono Jacket',
                materialSource: 'Bank Sampah Tekstil Majalaya',
                mitraName: 'Ibu Ratna (Bandung)',
                impactMetrics: {}
              })
            }
          }
        }
      }
    }
  })

  // 8. Seed Catalog Item for Customer Portal
  await prisma.catalogItem.upsert({
    where: { slug: 'upcycled-denim-eco-kimono-jacket' },
    update: {},
    create: {
      slug: 'upcycled-denim-eco-kimono-jacket',
      productId: product.id,
      title: 'Upcycled Denim Eco-Kimono Jacket',
      price: 499000.0,
      depositAmount: 150000.0,
      stock: 5,
      isAvailable: true,
      dataOrigin: DataOrigin.demo
    }
  })

  console.log('✅ Demo Dataset Seeded Successfully:')
  console.log('   - Material Batch: MAT-2026-0001')
  console.log('   - Pattern:        PAT-2026-0001')
  console.log('   - Eco-Kit:        KIT-2026-0001')
  console.log('   - Order:          ORD-2026-0001')
  console.log('   - Product:        PRD-2026-0001')
  console.log('   - Catalog Item:   /catalog/upcycled-denim-eco-kimono-jacket')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
