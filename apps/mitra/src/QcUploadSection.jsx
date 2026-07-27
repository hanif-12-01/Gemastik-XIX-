import React, { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon, Camera } from 'lucide-react'
import { api } from '@ecothread/api-client'

export const QcUploadSection = ({ orderId, onSuccess }) => {
  const [photos, setPhotos] = useState({
    front: null,
    back: null,
    detail: null
  })

  const [previews, setPreviews] = useState({
    front: null,
    back: null,
    detail: null
  })

  const [uploading, setUploading] = useState({
    front: false,
    back: false,
    detail: false
  })

  const [uploadedUrls, setUploadedUrls] = useState({
    front: '',
    back: '',
    detail: ''
  })

  const [notes, setNotes] = useState('')
  const [actualSize, setActualSize] = useState('M')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = async (type, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(prev => ({ ...prev, [type]: true }))

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result }))
    }
    reader.readAsDataURL(file)

    try {
      const res = await api.uploadQcPhoto(file)
      setUploadedUrls(prev => ({ ...prev, [type]: res.url }))
      setPhotos(prev => ({ ...prev, [type]: file }))
    } catch (err) {
      console.error(`Upload error for ${type}:`, err)
      setError(err.message || `Gagal mengunggah foto ${type}`)
      setPreviews(prev => ({ ...prev, [type]: null }))
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleRemovePhoto = (type) => {
    setPhotos(prev => ({ ...prev, [type]: null }))
    setPreviews(prev => ({ ...prev, [type]: null }))
    setUploadedUrls(prev => ({ ...prev, [type]: '' }))
  }

  const isFormComplete = uploadedUrls.front && uploadedUrls.back && uploadedUrls.detail

  const handleSubmitQc = async (e) => {
    e.preventDefault()
    if (!isFormComplete) {
      setError('Harap lengkapi ketiga foto bukti QC (Depan, Belakang, Detail Jahitan)')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.submitQcEvidence(orderId, {
        frontPhoto: uploadedUrls.front,
        backPhoto: uploadedUrls.back,
        detailPhoto: uploadedUrls.detail,
        notes: notes || 'Jahitan selesai dan diperiksa',
        actualSize
      })
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Submit QC error:', err)
      setError(err.message || 'Gagal mengirimkan bukti QC ke sistem')
    } finally {
      setSubmitting(false)
    }
  }

  const renderUploadSlot = (type, title, description) => {
    const isUploaded = !!uploadedUrls[type]
    const isUploading = uploading[type]
    const previewUrl = previews[type]

    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-xs font-bold uppercase text-stone-600 tracking-wider flex items-center gap-1">
            {title} <span className="text-rose-500">*</span>
          </span>
          {isUploaded && (
            <span className="text-emerald-600 flex items-center gap-1 text-xs font-semibold">
              <CheckCircle2 size={14} /> Terunggah
            </span>
          )}
        </div>

        {previewUrl ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden group">
            <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemovePhoto(type)}
              className="absolute top-2 right-2 bg-stone-900/80 text-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="w-full h-44 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors p-4">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-emerald-600">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-semibold">Mengunggah Foto...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-2">
                  <Camera size={24} />
                </div>
                <span className="text-xs font-bold text-stone-800">Pilih Foto {title}</span>
                <span className="text-[10px] text-stone-500 mt-1">{description}</span>
                <span className="text-[9px] text-stone-400 mt-0.5">JPG, PNG, WebP (Maks. 5MB)</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(type, e)}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmitQc} className="space-y-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Upload className="text-emerald-600" size={20} /> Unggah Bukti Kualitas (QC Evidence)
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Wajib mengunggah 3 foto fisik produk hasil jahitan Anda sebelum dikirimkan ke Admin.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderUploadSlot('front', 'Tampak Depan', 'Foto produk utuh dari sisi depan')}
        {renderUploadSlot('back', 'Tampak Belakang', 'Foto produk utuh dari sisi belakang')}
        {renderUploadSlot('detail', 'Detail Jahitan', 'Foto jarak dekat bagian jahitan/kancing')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Ukuran Hasil Jahit (Actual Size)
          </label>
          <select
            value={actualSize}
            onChange={(e) => setActualSize(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-sm text-stone-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="S">S (Small)</option>
            <option value="M">M (Medium)</option>
            <option value="L">L (Large)</option>
            <option value="XL">XL (Extra Large)</option>
            <option value="Free Size">Free Size / All Size</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Catatan Tambahan Mitra
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Jahitan rapi, kancing kayu terpasang sempurna"
            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-sm text-stone-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormComplete || submitting}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Mengirimkan Bukti QC...
          </>
        ) : (
          'Kirim Bukti QC ke Admin'
        )}
      </button>
    </form>
  )
}
