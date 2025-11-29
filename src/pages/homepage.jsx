import HeroSection from "../component/home/HeroSection";

export default function Homepage({ onNavigate, onOpenSeries }) { 
    return(
        <div className="min-h-screen">
            <HeroSection 
            onNavigate={onNavigate} 
            onOpenSeries={onOpenSeries}
             />
        </div>
    )
} 