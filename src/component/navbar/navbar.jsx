import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'katalog', label: 'Katalog' },
    { id: 'genre', label: 'Genre' },
    { id: 'profile', label: 'Profile' }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleCreateSeries = () => {
    onNavigate('create-series');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block shadow-lg border-b border-black/10 sticky top-0 z-50 bg-[#28FF4A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <h1 className="text-2xl font-extrabold text-black tracking-wide">
              KatalogSeriesMu
            </h1>

            {/* Menu Navigasi */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xl font-bold tracking-wide transition-all duration-200 ${
                    currentPage === item.id
                      ? 'text-black scale-110'
                      : 'text-black/70 hover:text-black hover:scale-105'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Create Series Button */}
              <button
                onClick={handleCreateSeries}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                  currentPage === 'create-series'
                    ? 'bg-black text-white scale-110'
                    : 'bg-black text-white hover:scale-105'
                }`}
              >
                <Plus className="w-5 h-5" />
                Create
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden shadow-lg border-b border-black/10 sticky top-0 z-50 bg-[#28FF4A]">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Mobile */}
            <h1 className="text-lg font-extrabold text-black">
              KatalogSeriesMu
            </h1>

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-2 hover:bg-black/10 rounded-lg transition"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="pb-4 space-y-2 border-t border-black/10 mt-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${
                    currentPage === item.id
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Create Series Button Mobile */}
              <button
                onClick={handleCreateSeries}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  currentPage === 'create-series'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/5'
                }`}
              >
                <Plus className="w-5 h-5" />
                Create Series
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
