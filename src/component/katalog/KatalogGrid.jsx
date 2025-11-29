
import { useState, useEffect, useRef } from "react";
import { Star, Plus, Check } from "lucide-react";
import FavoriteService from "../../services/favoriteService";

export default function SeriesGrid({ series, onOpenSeries }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [userId] = useState('user_default'); // Default user identifier
  const cardRefs = useRef([]);

  // Load favorites from backend on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const result = await FavoriteService.getFavorites(userId);
        const favoriteIds = Array.isArray(result) ? result.map(fav => fav.series_id) : 
                           result?.data?.map(fav => fav.series_id) || [];
        setFavorites(new Set(favoriteIds));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, [userId]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, series.length);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setTimeout(() => {
            setVisibleCards((prev) => new Set(prev).add(index));
          }, (index % 5) * 150);
        }
      });
    }, { threshold: 0.2 });

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [series]);

  const toggleFavorite = async (id, e) => {
    e.preventDefault();
    try {
      if (favorites.has(id)) {
        // Remove from favorites
        await FavoriteService.removeFavorite(userId, id);
        setFavorites(prev => {
          const newFavs = new Set(prev);
          newFavs.delete(id);
          return newFavs;
        });
      } else {
        // Add to favorites
        await FavoriteService.addFavorite(userId, id);
        setFavorites(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Gagal mengubah favorit');
    }
  };

  return (
    <section className="w-full h-full overflow-y-auto">
      
      {/* Grid Poster - Full Size */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {series.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`transform transition-all duration-700 ${
              visibleCards.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
              {/* Image Container */}
              <div className="relative overflow-hidden flex-1">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className={`
                      p-3 rounded-full transition duration-200
                      ${favorites.has(item.id)
                        ? 'bg-red-600 text-white'
                        : 'bg-white/90 text-gray-700 hover:bg-white'
                      }
                    `}
                  >
                    {favorites.has(item.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-lg px-2 py-1 flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-800">{item.rating}</span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-3 bg-white flex flex-col flex-1">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                  {item.genre}
                </p>

                <div className="mt-auto">
                  <button 
                    onClick={() => onOpenSeries && onOpenSeries(item)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded transition font-semibold"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {series.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-700 text-lg">
            Series tidak ditemukan.
          </p>
        </div>
      )}
    </section>
  );
}
