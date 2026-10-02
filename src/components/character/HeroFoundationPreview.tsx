import React from 'react';
import { ParchmentPanel } from '../ui/BestiaryUI';
import { SectionRibbon, SquareTile } from '../ui/CodexPrimitives';
import './HeroFoundationPreview.css';

/** Local-only STEP 1 workbench. Never mounts the game provider or changes a save. */
export const HeroFoundationPreview: React.FC = () => (
  <main className="hero-foundation">
    <ParchmentPanel surface="tiled" className="hero-foundation-page" aria-labelledby="foundation-title">
      <SectionRibbon title="Сторінка героя" level={1} id="foundation-title" />
      <div className="hero-foundation-blank" aria-label="Базова пергаментна поверхня" />
      <div className="hero-foundation-rule" aria-hidden="true" />
      <div className="hero-foundation-samples" aria-label="Зразки повторно використовуваних елементів">
        <SectionRibbon title="Кодекс" className="hero-foundation-short-ribbon" />
        <SquareTile aria-label="Порожня квадратна плитка" />
      </div>
    </ParchmentPanel>
    <footer className="hero-foundation-footer">
      <span>Основа сторінки · Етап 1</span>
      <a href="/">Повернутися до гри</a>
    </footer>
  </main>
);
