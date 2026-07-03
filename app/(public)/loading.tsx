import React from 'react';
import { Mic } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 text-center">
      {/* Conteneur de l'icône avec effets de halo lumineux */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Effet lumineux arrière-plan */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
        
        {/* Cercle extérieur qui pulse lentement */}
        <div className="absolute w-20 h-20 rounded-full border border-gold/20 animate-ping [animation-duration:2.5s]" />
        
        {/* Cercle intermédiaire fixe avec reflet */}
        <div className="absolute w-16 h-16 rounded-full border border-gold/40 bg-surface/50 backdrop-blur-sm" />
        
        {/* Icône principale du micro dorée */}
        <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-surface-2 border border-gold/30 shadow-lg shadow-gold/10">
          <Mic className="w-6 h-6 text-gold animate-bounce [animation-duration:2s]" />
        </div>
      </div>

      {/* Texte de statut au design soigné */}
      <h3 className="text-lg font-bold tracking-wider font-outfit text-white mb-2 uppercase">
        Golden Mic <span className="text-gold-light">237</span>
      </h3>
      
      {/* Sous-titre de chargement animé */}
      <div className="flex items-center gap-1">
        <p className="text-xs tracking-widest text-white/50 uppercase font-medium animate-pulse">
          Chargement en cours
        </p>
        <span className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:0.1s]" />
          <span className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
          <span className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:0.3s]" />
        </span>
      </div>
    </div>
  );
}
