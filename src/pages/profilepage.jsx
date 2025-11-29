import { User, Heart, LogOut, Loader, Camera, X, Check } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import SeriesService from '../services/SeriesService';
import FavoriteService from '../services/favoriteService';
import { getUserProfile, updateUsername, updateAvatar } from '../services/userService';

export default function ProfilePage() {
  const [allSeries, setAllSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [userId] = useState('user_default');

  // ===== NEW: FRONTEND PROFILE STATE =====
  const [username, setUsername] = useState("Anime Lovers");
  const [avatar, setAvatar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  // Fetch series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const result = await SeriesService.getSeries();
        const seriesData = Array.isArray(result)
          ? result
          : (result?.data || result?.series || []);
        setAllSeries(seriesData);
      } catch (err) {
        console.error('Error fetching series:', err);
        setAllSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Fetch favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const result = await FavoriteService.getFavorites(userId);
        const favoriteIds = Array.isArray(result)
          ? result.map(f => f.series_id)
          : result?.data?.map(f => f.series_id) || [];
        setFavorites(favoriteIds);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [userId]);

  const favoriteSeries = useMemo(() => {
    return allSeries.filter(series => favorites.includes(series.id));
  }, [favorites, allSeries]);

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      if (favorites.includes(id)) {
        await FavoriteService.removeFavorite(userId, id);
        setFavorites(prev => prev.filter(f => f !== id));
      } else {
        await FavoriteService.addFavorite(userId, id);
        setFavorites(prev => [...prev, id]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Gagal mengubah favorit');
    }
  };

  // ===== NEW: HANDLE AVATAR UPLOAD =====
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setAvatar(previewURL);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/50">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold">{username}</h1>
            <p className="text-blue-100 mt-2">Member since November 2025</p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-2xl font-bold">{favorites.length}</p>
                <p className="text-sm text-blue-100">Favorit</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Favorites */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold">Series Favorit Saya</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-red-600 mr-2" />
              <p>Memuat...</p>
            </div>
          ) : favoriteSeries.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {favoriteSeries.map(series => (
                <div key={series.id} className="relative rounded-lg shadow-md overflow-hidden group">
                  <img src={series.image_url} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <button
                      onClick={() => toggleFavorite(series.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Hapus Favorit
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="font-semibold truncate">{series.title}</p>
                    <p className="text-xs text-gray-600">★ {series.rating}/10</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada favorit</p>
          )}
        </div>

        {/* SETTINGS */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Pengaturan</h2>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 mb-3"
          >
            <span className="font-semibold">Ubah Profil</span>
            <span>→</span>
          </button>

          
        </div>
      </div>

      {/* ===== MODAL EDIT PROFIL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Profil</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Avatar Input */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
                {avatar ? (
                  <img src={avatar} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-6 text-gray-400" />
                )}
              </div>

              <label className="mt-3 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200">
                <Camera className="w-5 h-5" />
                Ganti Foto
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Username</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Simpan Perubahan
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
