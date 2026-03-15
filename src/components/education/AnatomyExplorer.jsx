import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const PHASES = [
  { id: 'menstrual', label: 'anatomy.phases.menstrual', color: 'bg-pink-500', ring: 'ring-pink-400', text: 'text-pink-700', light: 'bg-pink-50', border: 'border-pink-300', badge: 'bg-pink-100 text-pink-700', dot: '#ec4899' },
  { id: 'follicular', label: 'anatomy.phases.follicular', color: 'bg-teal-500', ring: 'ring-teal-400', text: 'text-teal-700', light: 'bg-teal-50', border: 'border-teal-300', badge: 'bg-teal-100 text-teal-700', dot: '#14b8a6' },
  { id: 'ovulation', label: 'anatomy.phases.ovulation', color: 'bg-amber-500', ring: 'ring-amber-400', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-700', dot: '#f59e0b' },
  { id: 'luteal', label: 'anatomy.phases.luteal', color: 'bg-rose-500', ring: 'ring-rose-400', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-300', badge: 'bg-rose-100 text-rose-700', dot: '#f43f5e' },
];

const ORGANS = ['uterus', 'leftOvary', 'rightOvary', 'fallopianTubes', 'cervix', 'vagina'];

export default function AnatomyExplorer() {
  const { t } = useTranslation();
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [phaseModeOn, setPhaseModeOn] = useState(false);

  const phase = PHASES.find(p => p.id === activePhase) || PHASES[0];

  const handleOrganClick = (organ) => {
    setSelectedOrgan(prev => (prev === organ ? null : organ));
  };

  const handlePhaseToggle = (phaseId) => {
    if (!phaseModeOn) {
      setPhaseModeOn(true);
      setActivePhase(phaseId);
    } else if (activePhase === phaseId) {
      setPhaseModeOn(false);
      setActivePhase(null);
    } else {
      setActivePhase(phaseId);
    }
  };

  const isPhase = (id) => phaseModeOn && activePhase === id;

  return (
    <div className="mt-8 border border-pink-200 rounded-2xl overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-4 border-b border-pink-100">
        <h3 className="font-semibold text-gray-800 text-base">{t('anatomy.title')}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{t('anatomy.subtitle')}</p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 mr-1">{t('anatomy.phaseMode')}:</span>
          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePhaseToggle(p.id)}
              aria-pressed={phaseModeOn && activePhase === p.id}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                phaseModeOn && activePhase === p.id
                  ? `${p.color} text-white border-transparent shadow-sm scale-105`
                  : `bg-white ${p.text} ${p.border} hover:${p.light}`
              }`}
            >
              {t(p.label)}
            </button>
          ))}
          {phaseModeOn && (
            <button
              onClick={() => { setPhaseModeOn(false); setActivePhase(null); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 transition-colors"
            >
              {t('anatomy.phaseOff')}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-0">
        <div className="flex-1 flex items-center justify-center p-4 min-h-[340px]">
          <ReproductiveSVG
            activePhase={phaseModeOn ? activePhase : null}
            selectedOrgan={selectedOrgan}
            onOrganClick={handleOrganClick}
          />
        </div>

        {selectedOrgan ? (
          <div className="md:w-80 border-t md:border-t-0 md:border-l border-pink-100 bg-pink-50/40">
            <OrganPanel
              organ={selectedOrgan}
              onClose={() => setSelectedOrgan(null)}
            />
          </div>
        ) : (
          <div className="md:w-72 border-t md:border-t-0 md:border-l border-pink-100 p-5 flex flex-col justify-center">
            <p className="text-xs text-gray-400 text-center">{t('anatomy.tapPrompt')}</p>
            <div className="mt-4 space-y-1.5">
              {ORGANS.map(organ => (
                <button
                  key={organ}
                  onClick={() => handleOrganClick(organ)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors"
                >
                  {t(`anatomy.organs.${organ}.name`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {phaseModeOn && activePhase && (
        <div className={`px-5 py-3 border-t ${phase.light} ${phase.border} border-t`}>
          <p className={`text-xs font-semibold ${phase.text} mb-1`}>
            {t(phase.label)} — {t('anatomy.whatHappening')}
          </p>
          <p className={`text-xs ${phase.text} opacity-90 leading-relaxed`}>
            {t(`anatomy.phaseOverview.${activePhase}`)}
          </p>
        </div>
      )}

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">{t('anatomy.educationalNote')}</p>
      </div>
    </div>
  );
}

function OrganPanel({ organ, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="p-5 h-full">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 text-sm leading-snug">
          {t(`anatomy.organs.${organ}.name`)}
        </h4>
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className="p-1 rounded-lg hover:bg-pink-100 text-gray-400 hover:text-pink-600 transition-colors flex-shrink-0 ml-2"
        >
          <X size={14} />
        </button>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        {t(`anatomy.organs.${organ}.what`)}
      </p>

      <p className="text-xs font-semibold text-gray-700 mb-2">{t('anatomy.duringPhases')}</p>
      <div className="space-y-2">
        {PHASES.map(p => (
          <div key={p.id} className={`rounded-lg px-3 py-2 border ${p.light} ${p.border}`}>
            <p className={`text-xs font-medium ${p.text} mb-0.5`}>{t(p.label)}</p>
            <p className={`text-xs ${p.text} opacity-80 leading-relaxed`}>
              {t(`anatomy.organs.${organ}.phases.${p.id}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReproductiveSVG({ activePhase, selectedOrgan, onOrganClick }) {
  const { t } = useTranslation();

  const isSelected = (id) => selectedOrgan === id;
  const isPhase = (id) => activePhase === id;

  const uterusFill = () => {
    if (activePhase === 'menstrual') return '#fda4af';
    if (activePhase === 'luteal') return '#fda4af';
    if (activePhase === 'follicular') return '#fbcfe8';
    if (activePhase === 'ovulation') return '#fbcfe8';
    if (isSelected('uterus')) return '#fce7f3';
    return '#fce7f3';
  };

  const ovaryFill = (side) => {
    if (activePhase === 'ovulation' && side === 'right') return '#fde68a';
    if (activePhase === 'follicular' && side === 'right') return '#99f6e4';
    if (activePhase === 'luteal' && side === 'right') return '#fda4af';
    if (isSelected(`${side}Ovary`)) return '#fce7f3';
    return '#fce7f3';
  };

  return (
    <svg
      viewBox="0 0 320 280"
      className="w-full max-w-xs md:max-w-sm select-none"
      aria-label={t('anatomy.svgAriaLabel')}
      role="img"
    >
      <defs>
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .anim-shed, .anim-follicle, .anim-egg, .anim-lining { animation: none !important; opacity: 1 !important; }
          }
          @keyframes shed {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(8px); opacity: 0; }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.7; r: 7; }
            50% { opacity: 1; r: 9; }
          }
          @keyframes float-egg {
            0% { transform: translate(0,0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-28px,-10px); opacity: 0.8; }
          }
          @keyframes fade-in {
            from { opacity: 0; } to { opacity: 1; }
          }
          @keyframes grow-follicle {
            0% { r: 4; } 100% { r: 7; }
          }
          .anim-shed { animation: shed 1.8s ease-in-out infinite; }
          .anim-follicle { animation: grow-follicle 2s ease-in-out infinite alternate; }
          .anim-egg { animation: float-egg 3s ease-in-out infinite; }
          .anim-lining { animation: fade-in 1s ease-in-out; }
        `}</style>
        <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <text x="160" y="16" textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="system-ui">
        {t('anatomy.svgLabel')}
      </text>

      {/* === FALLOPIAN TUBES === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.fallopianTubes.name')}
        tabIndex={0}
        onClick={() => onOrganClick('fallopianTubes')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('fallopianTubes')}
        style={{ cursor: 'pointer' }}
      >
        <path
          d="M 118 110 Q 90 100 72 105 Q 58 108 55 120"
          fill="none"
          stroke={isSelected('fallopianTubes') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('fallopianTubes') ? '4' : '3'}
          strokeLinecap="round"
        />
        <path
          d="M 202 110 Q 230 100 248 105 Q 262 108 265 120"
          fill="none"
          stroke={isSelected('fallopianTubes') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('fallopianTubes') ? '4' : '3'}
          strokeLinecap="round"
        />
        <path
          d="M 52 120 Q 50 128 55 134 Q 58 138 65 136 Q 72 134 70 128"
          fill="none"
          stroke={isSelected('fallopianTubes') ? '#ec4899' : '#f9a8d4'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 268 120 Q 270 128 265 134 Q 262 138 255 136 Q 248 134 250 128"
          fill="none"
          stroke={isSelected('fallopianTubes') ? '#ec4899' : '#f9a8d4'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="72" y="94" width="176" height="30" fill="transparent" />
      </g>

      {/* === LEFT OVARY (right side visually) === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.rightOvary.name')}
        tabIndex={0}
        onClick={() => onOrganClick('rightOvary')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('rightOvary')}
        style={{ cursor: 'pointer' }}
      >
        <ellipse
          cx="260"
          cy="132"
          rx="17"
          ry="13"
          fill={ovaryFill('right')}
          stroke={isSelected('rightOvary') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('rightOvary') ? '2.5' : '1.5'}
          filter={activePhase === 'ovulation' ? 'url(#glow-amber)' : undefined}
        />
        {activePhase === 'follicular' && (
          <circle cx="257" cy="130" r="6" fill="#5eead4" opacity="0.9" className="anim-follicle" />
        )}
        {activePhase === 'ovulation' && (
          <circle cx="255" cy="128" r="6" fill="#fbbf24" opacity="0.95" filter="url(#glow-amber)" className="anim-follicle" />
        )}
        {activePhase === 'luteal' && (
          <ellipse cx="260" cy="132" rx="9" ry="7" fill="#fb7185" opacity="0.7" className="anim-lining" />
        )}
      </g>

      {/* === RIGHT OVARY (left side visually) === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.leftOvary.name')}
        tabIndex={0}
        onClick={() => onOrganClick('leftOvary')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('leftOvary')}
        style={{ cursor: 'pointer' }}
      >
        <ellipse
          cx="60"
          cy="132"
          rx="17"
          ry="13"
          fill={ovaryFill('left')}
          stroke={isSelected('leftOvary') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('leftOvary') ? '2.5' : '1.5'}
        />
      </g>

      {/* === UTERUS === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.uterus.name')}
        tabIndex={0}
        onClick={() => onOrganClick('uterus')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('uterus')}
        style={{ cursor: 'pointer' }}
      >
        <path
          d="M 118 108 C 108 108 100 115 100 130 C 100 155 108 175 128 185 C 140 191 148 192 160 192 C 172 192 180 191 192 185 C 212 175 220 155 220 130 C 220 115 212 108 202 108 Z"
          fill={uterusFill()}
          stroke={isSelected('uterus') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('uterus') ? '2.5' : '1.5'}
          filter={activePhase === 'menstrual' ? 'url(#glow-pink)' : undefined}
        />
        {(activePhase === 'luteal' || activePhase === 'follicular') && (
          <path
            d="M 118 108 C 108 108 100 115 100 130 C 100 155 108 175 128 185 C 140 191 148 192 160 192 C 172 192 180 191 192 185 C 212 175 220 155 220 130 C 220 115 212 108 202 108 Z"
            fill="none"
            stroke={activePhase === 'luteal' ? '#fb7185' : '#5eead4'}
            strokeWidth="5"
            opacity="0.4"
            className="anim-lining"
          />
        )}
        {activePhase === 'menstrual' && (
          <>
            <ellipse cx="150" cy="165" rx="12" ry="6" fill="#e11d48" opacity="0.35" className="anim-shed" />
            <ellipse cx="168" cy="172" rx="8" ry="4" fill="#e11d48" opacity="0.3" className="anim-shed" style={{ animationDelay: '0.4s' }} />
            <ellipse cx="158" cy="158" rx="9" ry="4" fill="#e11d48" opacity="0.25" className="anim-shed" style={{ animationDelay: '0.8s' }} />
          </>
        )}
        <text x="160" y="152" textAnchor="middle" fontSize="8.5" fill="#be185d" fontWeight="500" pointerEvents="none">
          {t('anatomy.organs.uterus.name')}
        </text>
      </g>

      {/* Ovulation egg travelling to tube */}
      {activePhase === 'ovulation' && (
        <circle cx="248" cy="120" r="4.5" fill="#fbbf24" opacity="0.9" filter="url(#glow-amber)" className="anim-egg" />
      )}

      {/* === CERVIX === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.cervix.name')}
        tabIndex={0}
        onClick={() => onOrganClick('cervix')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('cervix')}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x="148"
          y="192"
          width="24"
          height="18"
          rx="4"
          fill={isSelected('cervix') ? '#fce7f3' : '#fce7f3'}
          stroke={isSelected('cervix') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('cervix') ? '2.5' : '1.5'}
        />
        <text x="160" y="205" textAnchor="middle" fontSize="6.5" fill="#be185d" pointerEvents="none">
          {t('anatomy.organs.cervix.name')}
        </text>
      </g>

      {/* === VAGINA === */}
      <g
        role="button"
        aria-label={t('anatomy.organs.vagina.name')}
        tabIndex={0}
        onClick={() => onOrganClick('vagina')}
        onKeyDown={e => e.key === 'Enter' && onOrganClick('vagina')}
        style={{ cursor: 'pointer' }}
      >
        <path
          d="M 152 210 C 150 218 149 228 150 238 C 151 244 155 248 160 248 C 165 248 169 244 170 238 C 171 228 170 218 168 210 Z"
          fill={isSelected('vagina') ? '#fce7f3' : '#fce7f3'}
          stroke={isSelected('vagina') ? '#ec4899' : '#f9a8d4'}
          strokeWidth={isSelected('vagina') ? '2.5' : '1.5'}
        />
        <text x="160" y="232" textAnchor="middle" fontSize="6.5" fill="#be185d" pointerEvents="none">
          {t('anatomy.organs.vagina.name')}
        </text>
      </g>

      {/* Labels for ovaries and tubes */}
      <text x="255" y="153" textAnchor="middle" fontSize="7" fill="#9ca3af" pointerEvents="none">
        {t('anatomy.organs.rightOvary.shortLabel')}
      </text>
      <text x="65" y="153" textAnchor="middle" fontSize="7" fill="#9ca3af" pointerEvents="none">
        {t('anatomy.organs.leftOvary.shortLabel')}
      </text>
      <text x="160" y="93" textAnchor="middle" fontSize="7" fill="#9ca3af" pointerEvents="none">
        {t('anatomy.organs.fallopianTubes.shortLabel')}
      </text>
    </svg>
  );
}
