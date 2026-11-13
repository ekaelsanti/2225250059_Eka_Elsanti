// F-01 Onboarding bertahap (K01): 4 layar pendek, bisa dilewati.
import { useState } from 'react';
import { ONBOARDING } from '../content/strings.id.js';
import { update } from '../store/store.js';

export default function OnboardingScreen() {
  const [i, setI] = useState(0);
  const finish = () => update(() => ({ onboardingDone: true }));
  const slide = ONBOARDING[i];
  const last = i === ONBOARDING.length - 1;
  return (
    <div className="onboarding">
      <button className="link-btn skip" onClick={finish}>
        Lewati
      </button>
      <div className="onb-icon" aria-hidden="true">
        {slide.icon}
      </div>
      <h1>{slide.title}</h1>
      <p>{slide.text}</p>
      <div className="dots" aria-label={`Layar ${i + 1} dari ${ONBOARDING.length}`}>
        {ONBOARDING.map((_, j) => (
          <span key={j} className={j === i ? 'on' : ''} />
        ))}
      </div>
      <div className="onb-actions">
        {i > 0 && (
          <button className="btn" onClick={() => setI(i - 1)}>
            ‹ Kembali
          </button>
        )}
        <button className="btn primary" onClick={() => (last ? finish() : setI(i + 1))}>
          {last ? 'Mulai belajar' : 'Lanjut ›'}
        </button>
      </div>
    </div>
  );
}
