import { useState, useMemo, useEffect } from 'react';
import SeriesGrid from '../component/katalog/KatalogGrid';
import { Loader } from 'lucide-react';
import SeriesService from '../services/SeriesService';

const GENRES = [
  'All',
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

export default function GenrePage({ onOpenSeries }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [allSeries, setAllSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch series from backend
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await SeriesService.getSeries();
        
        // Handle both array response and object with data property
        const seriesData = Array.isArray(result) ? result : (result?.data || result?.series || []);
        setAllSeries(seriesData);
      } catch (err) {
        console.error('Error fetching series:', err);
        setError('Gagal memuat series dari server');
        setAllSeries([]); // No fallback to static data
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const filteredSeries = useMemo(() => {
    if (selectedGenre === 'All') {
      return allSeries;
    }
    return allSeries.filter(series =>
      (series.genre && series.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    );
  }, [selectedGenre, allSeries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Jelajahi Berdasarkan Genre
          </h1>
          <p className="text-lg text-white/90">
            Temukan series favorit Anda dari berbagai genre
          </p>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pilih Genre:</h2>
          <div className="flex flex-wrap gap-3">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Ditemukan <span className="text-purple-600">{filteredSeries.length}</span> series
          </p>
        </div>

        {/* Series Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
            <p className="ml-3 text-gray-600">Memuat series...</p>
          </div>
        ) : filteredSeries.length > 0 ? (
          <SeriesGrid series={filteredSeries} onOpenSeries={onOpenSeries} />
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-xl text-gray-500">
              Tidak ada series untuk genre "{selectedGenre}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
