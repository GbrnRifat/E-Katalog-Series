// src/pages/KatalogPage.jsx
import { useState, useEffect } from 'react';
import SeriesGrid from '../component/katalog/KatalogGrid';
import { Search, Filter, Loader } from 'lucide-react';
import SeriesService from '../services/SeriesService';
import { DataSeries } from '../data/series';

export default function KatalogPage({ onOpenSeries }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch series from backend
 useEffect(() => {
  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await SeriesService.getSeries();

      const seriesData = Array.isArray(result)
        ? result
        : (result?.data || result?.series || []);
      
      setAllSeries(seriesData);

    } catch (err) {
      console.warn("⚠ API gagal, menggunakan data lokal dari DataSeries");

      const localSeries = Object.values(DataSeries.series || {});
      setAllSeries(localSeries);
    } finally {
      setLoading(false);
    }
  };

  fetchSeries();
}, []);


  useEffect(() => {
    let filtered = allSeries;

    // Filter berdasarkan search query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.genre && item.genre.toLowerCase().includes(lowerQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'year') {
      // Support both 'tahun' (backend) and 'year' (static data)
      filtered.sort((a, b) => (b.tahun || b.year || 0) - (a.tahun || a.year || 0));
    }

    setFilteredSeries(filtered);
  }, [searchQuery, sortBy, allSeries]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center">Jelajahi Katalog</h1>
          <p className="text-blue-100 text-sm mt-1 text-center">Temukan series favorit Anda</p>
        </div>
      </div>

      {/* Search and Filter - Compact */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto space-y-3">
          
          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              <Search className="inline mr-1" size={12} />
              Cari Series
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, genre, atau deskripsi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition text-sm text-gray-800"
            />
          </div>

          {/* Sort and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <Filter className="inline mr-1" size={12} />
                Urutkan Berdasarkan
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition text-sm text-gray-800 bg-white"
              >
                <option value="title">Judul (A-Z)</option>
                <option value="rating">Rating (Tertinggi)</option>
                <option value="year">Tahun (Terbaru)</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg px-3 py-2 w-full">
                <p className="text-xs text-gray-600">
                  <span className="font-bold text-blue-600">{filteredSeries.length}</span> series
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Series Grid - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600">Memuat series...</p>
          </div>
        ) : filteredSeries.length > 0 ? (
          <SeriesGrid series={filteredSeries} onOpenSeries={onOpenSeries} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-xl text-gray-500 mb-2">
              Tidak ada series ditemukan
            </p>
            <p className="text-gray-400 text-sm">
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
