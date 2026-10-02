import React from 'react';
import { ParchmentPanel } from '../ui/BestiaryUI';
import { SectionRibbon } from '../ui/CodexPrimitives';

export const TelegramEntry: React.FC = () => (
  <main className="telegram-entry">
    <ParchmentPanel surface="tiled" aria-labelledby="telegram-entry-title">
      <SectionRibbon title="Кодекс чекає" level={1} id="telegram-entry-title" />
      <p>Відкрий гру через Telegram Mini App.</p>
      <p>Перейди до бота гри в Telegram і натисни кнопку запуску.</p>
    </ParchmentPanel>
  </main>
);
