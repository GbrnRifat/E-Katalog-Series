// src/pages/SeriesDetailPage.jsx
import { ArrowLeft, Calendar, Tag, FileText, Loader, Send } from "lucide-react";
import { useState, useEffect } from "react";
import ReviewService from "../services/reviewService";

export default function SeriesDetailPage({ series, onBack }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');
  const [userIdentifier] = useState('user_default'); // Default user identifier

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Data series tidak ditemukan.
      </div>
    );
  }

  if (!series.id) {
    console.error('[SeriesDetailPage] Series object missing id:', series);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error: Series ID tidak ditemukan</p>
          <p className="text-slate-600 text-sm">Silakan kembali dan coba lagi</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Load reviews from backend
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        setError('');
        const result = await ReviewService.getReviews(series.id);
        const reviewsData = Array.isArray(result) ? result : (result?.data || result?.reviews || []);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Gagal memuat review');
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (series.id) {
      loadReviews();
    }
  }, [series.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.trim()) {
      setError('Review tidak boleh kosong');
      return;
    }

    try {
      setSubmittingReview(true);
      setError('');

      const reviewData = {
        user: userIdentifier,
        rating: Number(rating),
        comment: newReview
      };

      const result = await ReviewService.createReview(series.id, reviewData);
      console.log('[ReviewService] Response:', result);

      // Add review to list
      const newReviewItem = {
        id: result?.data?.id || Date.now(),
        user: userIdentifier,
        rating: Number(rating),
        comment: newReview,
        created_at: new Date().toISOString()
      };

      setReviews(prev => [newReviewItem, ...prev]);
      setNewReview('');
      setRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Gagal menambahkan review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-24 md:pb-10">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            {series.title || series.name}
          </h1>

          {/* Image */}
          {(series.image_url || series.posterUrl) && (
            <div className="w-full mb-8">
              <img
                src={series.image_url || series.posterUrl}
                alt={series.title || series.name}
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            
            {/* Genre */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Tag className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Genre</p>
                <p className="text-slate-800 font-medium">{series.genre}</p>
              </div>
            </div>

            {/* Release Year */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Tahun Rilis</p>
                <p className="text-slate-800 font-medium">{series.tahun || series.year || series.releaseYear || '-'}</p>
              </div>
            </div>

            {/* Rating */}
            {series.rating && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-6 h-6 text-yellow-600 text-lg">⭐</div>
                <div>
                  <p className="text-sm text-slate-500">Rating</p>
                  <p className="text-slate-800 font-medium">{series.rating}/10</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {series.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Deskripsi
              </h2>

              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {series.description}
              </p>
            </div>
          )}

          {/* Review Section */}
          <div className="border-t border-slate-200 pt-12 mt-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-8">Review & Komentar</h2>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Add Review Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10 border border-blue-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tambahkan Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating (1-10)
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="flex-1 h-3 bg-gradient-to-r from-red-400 to-yellow-400 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      style={{
                        WebkitAppearance: 'slider-horizontal',
                      }}
                    />
                    <div className="flex items-center gap-2 min-w-fit">
                      <span className="text-2xl">⭐</span>
                      <span className="text-lg font-bold text-slate-800 w-8 text-center">{rating}</span>
                      <span className="text-xs text-slate-500">/10</span>
                    </div>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Komentar
                  </label>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Bagikan pendapat Anda tentang series ini..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                    disabled={submittingReview}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview || !newReview.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Review
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                Review ({reviews.length})
              </h3>

              {loadingReviews ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-800">{review.user || 'Anonymous'}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-slate-800">{review.rating}/10</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">Belum ada review. Jadilah yang pertama!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
