import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  className?: string;
  variant?: 'button' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className={`bg-blue-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between gap-4 shadow-sm ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700/80 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-semibold">Instale o AngolaMarket no seu telemóvel</p>
              <p className="text-xs text-blue-200">Acesso rápido, compras mais rápidas e notificações de encomendas.</p>
            </div>
          </div>
          <button
            onClick={install}
            className="shrink-0 px-3.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Instalar App
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${className}`}
        title="Instalar AngolaMarket no seu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-blue-600" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${className}`}
          title="Instalar no iPhone ou iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Como instalar no iPhone / iPad</h3>
              <div className="mt-3 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Toque no botão de <strong>Partilha (Share)</strong> na barra inferior do Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Role para baixo e selecione <strong>Ecrã Principal (Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Toque em <strong>Adicionar</strong> no canto superior direito para concluir.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
