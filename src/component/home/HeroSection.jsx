import { Clapperboard, Star, Play, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import SeriesService from "../../services/SeriesService";

export default function HeroSection({ onNavigate, onOpenSeries }) {
  const [featuredSeries, setFeaturedSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSeries = async () => {
      try {
        setLoading(true);
        const result = await SeriesService.getSeries();
        
        // Handle both array response and object with data property
        const seriesData = Array.isArray(result) ? result : (result?.data || result?.series || []);
        
        // Get first 2 series
        setFeaturedSeries(seriesData.slice(0, 2));
      } catch (err) {
        console.error('Error fetching featured series:', err);
        setFeaturedSeries([]); // No fallback to static data
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSeries();
  }, []);

  return (
    <section className=" relative w-full bg-gradient-to-br from-[#00CFFF] via-[#0099CC] to-[#0073AA] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* Grid Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-24 items-center mb-16">

          {/* === TEXT AREA === */}
          <div className="text-white">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight font-['Anton']">
              Selamat Datang di <br />
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200 mt-2">
                KatalogSeriesMu
              </span>
            </h1>

            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              Jelajahi ribuan series dari berbagai belahan dunia. Temukan series favorit Anda, lihat rating, dan jangan lewatkan rekomendasi spesial kami.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('katalog')}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition transform hover:scale-105 duration-200"
              >
                <Clapperboard className="w-5 h-5" />
                Jelajahi Katalog
              </button>

              <button 
                onClick={() => onNavigate('genre')}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-xl font-bold shadow-lg transition transform hover:scale-105 duration-200"
              >
                <Star className="w-5 h-5" />
                Cek Genre Favorit
              </button>
            </div>
          </div>

          {/* === KOTAK GAMBAR FEATURED SERIES (Digeser ke kanan) === */}
          <div className="hidden lg:flex flex-col gap-6 absolute top-20 right-14 z-20">
            {loading ? (
              <div className="flex items-center justify-center w-[360px] h-64">
                <Loader className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : (
              featuredSeries.map((series, index) => (
                <button
                  key={index}
                  onClick={() => onOpenSeries && onOpenSeries(series)}
                  className="relative group overflow-hidden rounded-2xl shadow-2xl w-[360px] hover:scale-105 transition cursor-pointer text-left"
                >
                  <img
                    src={series.image_url}
                    alt={series.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Overlay Play Button */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>

                  {/* Gradient Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <p className="text-white font-bold text-lg">{series.title}</p>
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{series.rating}/10</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

        </div>

        {/* === SECTION STATS === */}
        <div className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-50 lg:mt-70 ">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">500+</p>
            <p className="text-white/70 mt-2">Series</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">13</p>
            <p className="text-white/70 mt-2">Genre</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">10K+</p>
            <p className="text-white/70 mt-2">Users</p>
          </div>
        </div>

      </div>
    </section>
  );
}
