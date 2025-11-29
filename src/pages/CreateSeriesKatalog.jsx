// src/pages/CreateSeriesKatalog.jsx
import { useState } from 'react';
import { ArrowLeft, X, Image as ImageIcon, Loader, ChevronDown, Check } from 'lucide-react';
import SeriesService from '../services/SeriesService';

// LIST GENRE
const GENRE_OPTIONS = [
  'Crime',
  'Drama',
  'History',
  'Fantasy',
  'Horror',
  'Action',
  'Mystery',
  'Adventure',
  'Comedy',
  'Romance',
  'Sci-Fi',
  'Anime',
  'Thriller'
];

export default function CreateSeriesPage({ onBack, onSuccess }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    releaseYear: '',
    rating: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return setError("Ukuran max 5MB");
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return setError("Format tidak valid");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleUploadImage = async () => {
    if (!imageFile) return setError("Pilih gambar dulu");

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageUrl(e.target.result);
        setImageFile(null);
        setImagePreview(null);
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      setError("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImagePreview = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  /* ---------------- FORM ---------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // TOGGLE GENRE
  const toggleGenre = (g) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((x) => x !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Nama wajib"), false;
    if (selectedGenres.length === 0) return setError("Pilih minimal 1 genre"), false;
    if (!formData.releaseYear) return setError("Tahun rilis wajib"), false;
    if (!formData.rating) return setError("Rating wajib"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!uploadedImageUrl) return setError("Upload poster dulu");
    if (!validateForm()) return;

    try {
      setCreating(true);

      const payload = {
        title: formData.name,
        genre: selectedGenres.join(', '),
        description: formData.description,
        tahun: Number(formData.releaseYear),
        image_url: uploadedImageUrl,
        rating: Number(formData.rating),
        status: "upcoming",
      };

      const result = await SeriesService.createSeries(payload);

      alert("Series berhasil dibuat!");
      if (onSuccess) onSuccess(result);

      setFormData({ name: '', description: '', releaseYear: '', rating: '' });
      setSelectedGenres([]);
      setUploadedImageUrl('');

      onBack();
    } catch (err) {
      setError("Gagal membuat series");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20 md:pb-8">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Buat Series</h1>
          <p className="text-slate-600 mb-8">Tambahkan series baru ke katalog</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* POSTER */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Poster Series</label>

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} className="w-full h-64 object-cover rounded-xl" />
                  <button type="button" onClick={handleRemoveImagePreview} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : uploadedImageUrl ? (
                <img src={uploadedImageUrl} className="w-full h-64 object-cover rounded-xl" />
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                  <input id="poster-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="poster-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-slate-700 font-medium">Klik untuk pilih poster</p>
                  </label>
                </div>
              )}

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={!imageFile || uploading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-50"
                >
                  {uploading ? "Mengunggah..." : "Upload Gambar"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setUploadedImageUrl('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Hapus Gambar
                </button>
              </div>
            </div>

            {/* FORM INPUT */}
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Series *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                />
              </div>

              {/* 🔥 DROPDOWN GENRE MULTI SELECT */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Genre *</label>

                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl flex justify-between items-center"
                >
                  <span className="text-left text-slate-700">
                    {selectedGenres.length === 0 ? "Pilih genre..." : selectedGenres.join(", ")}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-20 bg-white border border-slate-200 rounded-xl mt-2 w-full shadow-lg max-h-56 overflow-auto p-2">
                    {GENRE_OPTIONS.map((g) => (
                      <div
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-purple-100"
                      >
                        <div className={`w-5 h-5 flex items-center justify-center border rounded ${selectedGenres.includes(g) ? "bg-purple-600 border-purple-600" : "border-slate-400"}`}>
                          {selectedGenres.includes(g) && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DESKRIPSI */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tahun Rilis *</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating (0–10) *</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button type="button" onClick={onBack} disabled={creating} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">
                Batal
              </button>

              <button type="submit" disabled={creating} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2">
                {creating ? <Loader className="w-5 h-5 animate-spin" /> : "Simpan Series"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
