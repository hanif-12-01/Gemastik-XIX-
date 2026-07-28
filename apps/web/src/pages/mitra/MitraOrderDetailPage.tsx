import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Send,
  XCircle
} from 'lucide-react'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { apiClient } from '../../lib/api'
import { formatRupiah, getMitraStatus } from '../../lib/mitra-ui'

const workStages = [
  { label: 'Bahan sudah diperiksa', stepName: 'Bahan diperiksa', percentage: 20 },
  { label: 'Sedang memotong kain', stepName: 'Pemotongan kain', percentage: 40 },
  { label: 'Sedang menjahit', stepName: 'Proses jahit', percentage: 70 },
  { label: 'Sedang merapikan hasil', stepName: 'Finishing', percentage: 90 }
]

type PhotoKind = 'front' | 'back' | 'detail'

export const MitraOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [issueType, setIssueType] = useState('material_shortage')
  const [issueDescription, setIssueDescription] = useState('')
  const [frontPhoto, setFrontPhoto] = useState('')
  const [backPhoto, setBackPhoto] = useState('')
  const [detailPhoto, setDetailPhoto] = useState('')
  const [qcNotes, setQcNotes] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState<PhotoKind | null>(null)

  const fetchDetail = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getMitraOrderDetail(id)
      setOrder(data)
    } catch (err: any) {
      setError(err.message || 'Rincian pekerjaan belum bisa dibuka.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const runAction = async (
    actionName: string,
    action: () => Promise<unknown>,
    successText: string
  ) => {
    setBusyAction(actionName)
    setError(null)
    setSuccessMessage(null)

    try {
      await action()
      setSuccessMessage(successText)
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Belum berhasil disimpan. Silakan coba lagi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleAccept = () =>
    runAction(
      'accept',
      () => apiClient.acceptOrder(id!),
      'Pekerjaan berhasil diterima. Terima kasih, Ibu!'
    )

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault()
    await runAction(
      'reject',
      () => apiClient.rejectOrder(id!, rejectionReason),
      'Jawaban Ibu sudah disimpan. EcoThread akan mencarikan pekerjaan lain.'
    )
    setShowRejectForm(false)
  }

  const handleStage = (stage: typeof workStages[number]) =>
    runAction(
      stage.stepName,
      () =>
        apiClient.updateProgress(id!, {
          stepName: stage.stepName,
          percentage: stage.percentage,
          notes: stage.label
        }),
      `Tahap “${stage.label}” sudah tersimpan.`
    )

  const handlePhoto = async (
    kind: PhotoKind,
    file: File | undefined,
    saveUrl: (url: string) => void
  ) => {
    if (!file) return

    setUploadingPhoto(kind)
    setError(null)

    try {
      const uploaded = await apiClient.uploadQcPhoto(file)
      saveUrl(uploaded.url)
    } catch (err: any) {
      setError(err.message || 'Foto belum berhasil diunggah. Pastikan ukurannya di bawah 5 MB.')
    } finally {
      setUploadingPhoto(null)
    }
  }

  const handleSubmitPhotos = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!frontPhoto || !backPhoto || !detailPhoto) {
      setError('Pilih tiga foto: tampak depan, belakang, dan jahitan dekat.')
      return
    }

    await runAction(
      'submit-photos',
      () =>
        apiClient.submitQcEvidence(id!, {
          frontPhoto,
          backPhoto,
          detailPhoto,
          notes: qcNotes || 'Foto hasil jahitan dikirim oleh Mitra.'
        }),
      'Foto sudah terkirim. EcoThread akan memeriksa hasil jahitan Ibu.'
    )
  }

  const handleReportIssue = async (event: React.FormEvent) => {
    event.preventDefault()
    await runAction(
      'report-issue',
      () =>
        apiClient.createProductionIssue(id!, {
          issueType,
          severity: 'medium',
          description: issueDescription
        }),
      'Kendala sudah dikirim. Tim EcoThread akan membantu Ibu.'
    )
    setIssueDescription('')
  }

  if (loading) {
    return <LoadingSpinner message="Membuka rincian pekerjaan..." />
  }

  if (!order) {
    return (
      <div className="mitra-page">
        <Alert type="danger" title="Pekerjaan tidak ditemukan">
          {error || 'Pekerjaan ini tidak tersedia.'}
        </Alert>
        <Link to="/mitra/orders" className="btn btn-secondary">
          <ArrowLeft size={18} /> Kembali ke pekerjaan
        </Link>
      </div>
    )
  }

  const status = getMitraStatus(order.status)
  const active = ['accepted', 'kit_received', 'in_progress', 'qc_revision'].includes(order.status)
  const canUpdateStage = ['accepted', 'kit_received', 'in_progress'].includes(order.status)
  const targetDate = order.targetCompletion
    ? new Date(order.targetCompletion).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Belum ditentukan'
  const latestProgress = [...(order.productionProgress || [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0]

  return (
    <div className="mitra-page">
      <Link to="/mitra/orders" className="mitra-back">
        <ArrowLeft size={18} aria-hidden="true" />
        Kembali ke pekerjaan
      </Link>

      {successMessage && <Alert type="success" title="Berhasil">{successMessage}</Alert>}
      {error && <Alert type="danger" title="Belum berhasil">{error}</Alert>}

      <section className="mitra-detail-summary">
        <div className="mitra-job-card__top">
          <div>
            <p style={{ fontSize: '0.78rem', marginBottom: '0.25rem' }}>{order.orderCode}</p>
            <h1 style={{ margin: 0, fontSize: '1.45rem' }}>
              {order.ecoKit?.name || 'Pekerjaan jahit EcoThread'}
            </h1>
          </div>
          <span className={`mitra-status mitra-status--${status.tone}`}>
            {status.label}
          </span>
        </div>

        <p>{status.help}</p>

        <div className="mitra-detail-grid">
          <div>
            <span>Upah untuk Ibu</span>
            <strong>{formatRupiah(order.agreedPayoutRate)}</strong>
          </div>
          <div>
            <span>Selesai sebelum</span>
            <strong>{targetDate}</strong>
          </div>
          <div>
            <span>Pola jahitan</span>
            <strong>{order.ecoKit?.pattern?.name || 'Lihat petunjuk Eco-Kit'}</strong>
          </div>
          <div>
            <span>Kabar terakhir</span>
            <strong>{latestProgress?.stepName || status.label}</strong>
          </div>
        </div>

        <details className="mitra-disclosure" style={{ marginTop: 0 }}>
          <summary>Lihat bahan dan keterangan pekerjaan</summary>
          <div className="mitra-disclosure__body">
            <p>
              {order.ecoKit?.pattern?.description ||
                'Ikuti pola dan bahan yang tersedia di dalam Eco-Kit.'}
            </p>
            {(order.ecoKit?.ecoKitItems || []).map((item: any) => (
              <p key={item.id} style={{ marginTop: '0.5rem' }}>
                <strong>{item.batch?.materialType || 'Bahan tekstil'}</strong>
                {' · '}
                {item.quantity} {item.unit}
              </p>
            ))}
          </div>
        </details>
      </section>

      {order.status === 'offered' && (
        <section className="mitra-action-card">
          <h2>Apakah Ibu bisa mengerjakannya?</h2>
          <p>Pastikan jenis jahitan, upah, dan tanggal selesai sudah cocok.</p>
          <div className="mitra-job-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleAccept}
              className="btn btn-primary"
              disabled={busyAction === 'accept'}
            >
              <CheckCircle2 size={19} />
              {busyAction === 'accept' ? 'Menyimpan...' : 'Ya, saya terima'}
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm((current) => !current)}
              className="btn btn-secondary"
            >
              <XCircle size={19} />
              Tidak bisa
            </button>
          </div>

          {showRejectForm && (
            <form onSubmit={handleReject} style={{ marginTop: '1rem' }}>
              <label htmlFor="rejection-reason">Mengapa belum bisa menerima?</label>
              <select
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                required
              >
                <option value="">Pilih alasan</option>
                <option value="Pekerjaan jahit sedang penuh">Pekerjaan sedang penuh</option>
                <option value="Belum memiliki alat yang dibutuhkan">Alat belum tersedia</option>
                <option value="Waktu penyelesaian terlalu dekat">Waktunya terlalu dekat</option>
                <option value="Jenis jahitan belum dikuasai">Belum menguasai jenis jahitan</option>
              </select>
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={!rejectionReason || busyAction === 'reject'}
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Simpan jawaban
              </button>
            </form>
          )}
        </section>
      )}

      {active && (
        <>
          {canUpdateStage && (
            <section className="mitra-action-card">
              <h2>1. Jahitan sudah sampai tahap mana?</h2>
              <p>Tekan satu pilihan yang paling sesuai. Tidak perlu mengisi angka.</p>
              <div className="mitra-stage-buttons">
                {workStages.map((stage, index) => (
                  <button
                    type="button"
                    className="mitra-stage-button"
                    key={stage.stepName}
                    onClick={() => handleStage(stage)}
                    disabled={busyAction !== null}
                  >
                    <b>{index + 1}</b>
                    <span>{busyAction === stage.stepName ? 'Menyimpan...' : stage.label}</span>
                    <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="mitra-action-card">
            <h2>{canUpdateStage ? '2. Jika sudah selesai, kirim tiga foto' : 'Kirim ulang tiga foto setelah diperbaiki'}</h2>
            <p>Tekan setiap kotak untuk membuka kamera atau galeri. Maksimal 5 MB per foto.</p>

            <form onSubmit={handleSubmitPhotos}>
              <div className="mitra-photo-grid">
                <label className={`mitra-photo-input ${frontPhoto ? 'mitra-photo-input--ready' : ''}`}>
                  {frontPhoto ? <Check size={25} /> : <Camera size={25} />}
                  <span>{uploadingPhoto === 'front' ? 'Mengunggah...' : frontPhoto ? 'Foto depan siap' : 'Foto depan'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={(event) => handlePhoto('front', event.target.files?.[0], setFrontPhoto)}
                    disabled={uploadingPhoto !== null}
                  />
                </label>

                <label className={`mitra-photo-input ${backPhoto ? 'mitra-photo-input--ready' : ''}`}>
                  {backPhoto ? <Check size={25} /> : <Camera size={25} />}
                  <span>{uploadingPhoto === 'back' ? 'Mengunggah...' : backPhoto ? 'Foto belakang siap' : 'Foto belakang'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={(event) => handlePhoto('back', event.target.files?.[0], setBackPhoto)}
                    disabled={uploadingPhoto !== null}
                  />
                </label>

                <label className={`mitra-photo-input ${detailPhoto ? 'mitra-photo-input--ready' : ''}`}>
                  {detailPhoto ? <Check size={25} /> : <Camera size={25} />}
                  <span>{uploadingPhoto === 'detail' ? 'Mengunggah...' : detailPhoto ? 'Foto jahitan siap' : 'Foto jahitan dekat'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={(event) => handlePhoto('detail', event.target.files?.[0], setDetailPhoto)}
                    disabled={uploadingPhoto !== null}
                  />
                </label>
              </div>

              <label htmlFor="qc-notes">Catatan untuk EcoThread (boleh dikosongkan)</label>
              <textarea
                id="qc-notes"
                value={qcNotes}
                onChange={(event) => setQcNotes(event.target.value)}
                placeholder="Contoh: bagian lengan sudah dirapikan."
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !frontPhoto ||
                  !backPhoto ||
                  !detailPhoto ||
                  uploadingPhoto !== null ||
                  busyAction === 'submit-photos'
                }
                style={{ width: '100%', marginTop: '0.85rem' }}
              >
                <Send size={18} />
                {busyAction === 'submit-photos' ? 'Mengirim foto...' : 'Kirim hasil jahitan'}
              </button>
            </form>
          </section>

          <details className="mitra-disclosure">
            <summary>
              <AlertTriangle size={17} style={{ display: 'inline', marginRight: '0.45rem' }} />
              Ada kendala? Minta bantuan di sini
            </summary>
            <div className="mitra-disclosure__body">
              <form onSubmit={handleReportIssue}>
                <label htmlFor="issue-type">Kendala yang dialami</label>
                <select
                  id="issue-type"
                  value={issueType}
                  onChange={(event) => setIssueType(event.target.value)}
                >
                  <option value="material_shortage">Bahan kurang</option>
                  <option value="material_damage">Bahan rusak</option>
                  <option value="pattern_unclear">Petunjuk jahit kurang jelas</option>
                  <option value="equipment_problem">Alat jahit bermasalah</option>
                  <option value="deadline_risk">Butuh tambahan waktu</option>
                  <option value="other">Kendala lainnya</option>
                </select>

                <label htmlFor="issue-description" style={{ marginTop: '0.75rem' }}>
                  Ceritakan singkat kendalanya
                </label>
                <textarea
                  id="issue-description"
                  value={issueDescription}
                  onChange={(event) => setIssueDescription(event.target.value)}
                  placeholder="Contoh: kain denim kurang untuk bagian lengan."
                  required
                />

                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={!issueDescription || busyAction === 'report-issue'}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {busyAction === 'report-issue' ? 'Mengirim...' : 'Kirim permintaan bantuan'}
                </button>
              </form>
            </div>
          </details>
        </>
      )}

      {!active && order.status !== 'offered' && (
        <section className="mitra-next" style={{ marginTop: '1rem' }}>
          <div className="mitra-next__eyebrow">Langkah berikutnya</div>
          <h2>{status.label}</h2>
          <p>{status.help}</p>
          <Link to="/mitra/orders" className="btn btn-primary">
            Kembali ke daftar pekerjaan
          </Link>
        </section>
      )}
    </div>
  )
}
