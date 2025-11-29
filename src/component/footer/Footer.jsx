import { Github, Twitter, Facebook, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Branding */}
          <div>
            <h3 className="text-2xl font-bold mb-3">KatalogSeriesMu</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform terpadu untuk menemukan dan melacak series favorit Anda dari seluruh dunia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Katalog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Genre</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Profile</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tentang Kami</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Kontak</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; 2025 KatalogSeriesMu. Semua hak dilindungi.</p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>contact@katalogseriesmu.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
