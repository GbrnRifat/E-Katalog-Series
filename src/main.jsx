
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import Homepage from './pages/homepage'
import KatalogPage from './pages/KatalogPage'
import ProfilePage from './pages/profilepage'
import GenrePage from './pages/GenrePage'
import SeriesDetailPage from './pages/SeriesDetailPage'
import CreateSeriesKatalog from './pages/CreateSeriesKatalog'

import Navbar from './component/navbar/navbar'
import PWABadge from './PWABadge'

import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedSeries, setSelectedSeries] = useState(null)

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleOpenSeriesDetail = (series) => {
    setSelectedSeries(series)
    setCurrentPage('series-detail')
  }

  const handleBackFromDetail = () => {
    setSelectedSeries(null)
    setCurrentPage('katalog')
  }

  const handleBackFromCreate = () => {
    setCurrentPage('katalog')
  }

  const handleSeriesCreated = (newSeries) => {
    // Navigate back to katalog, which will auto-refresh to show new series
    setCurrentPage('katalog')
  }

  return (
    <div className="app-container">

      {/* Navbar selalu tampil */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Routing manual */}
      {currentPage === 'home' && <Homepage onNavigate={handleNavigate} onOpenSeries={handleOpenSeriesDetail} />}
      {currentPage === 'katalog' && <KatalogPage onOpenSeries={handleOpenSeriesDetail} />}
      {currentPage === 'genre' && <GenrePage onOpenSeries={handleOpenSeriesDetail} />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'series-detail' && selectedSeries && (
        <SeriesDetailPage series={selectedSeries} onBack={handleBackFromDetail} />
      )}
      {currentPage === 'create-series' && (
        <CreateSeriesKatalog onBack={handleBackFromCreate} onSuccess={handleSeriesCreated} />
      )}

      {/* Badge PWA */}
      <PWABadge />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
