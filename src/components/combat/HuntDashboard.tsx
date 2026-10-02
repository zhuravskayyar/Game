import React from 'react';
import type { AutoBattleSettings, Monster, PlayerCharacter, RegionModifier } from '../../types/game';
import type { RegionDefinition } from '../../data/gameData';
import type { RegionProgress } from '../../utils/regionalProgress';
import { BattleBackdrop, getBattleScene } from './BattleBackdrop';
import { BestiaryEntry, BestiaryPanel, FolioPage, OrnamentDivider, ParchmentPanel, RpgButton, RpgIconButton, SectionTitle, StatRow } from '../ui/BestiaryUI';
import { RpgIcon } from '../ui/RpgIcon';
import { getMonsterArtworkPath } from '../../utils/monsterArtwork';

interface HuntDashboardProps {
  player: PlayerCharacter;
  currentRegion: RegionDefinition;
  regionMonsters: Monster[];
  selectedMonster?: Monster;
  activeMod: RegionModifier;
  selectedLock: string | null;
  progress: RegionProgress;
  energyError: string | null;
  combatEnergyCost: number;
  autoBattle: AutoBattleSettings;
  isSettingsOpen: boolean;
  premiumActive: boolean;
  elixirPrice: number;
  getMonsterLock: (monster: Monster) => string | null;
  onSelectMonster: (monsterId: string) => void;
  onStartHunt: () => void;
  onToggleSettings: () => void;
  onUpdateAutoBattle: (settings: Partial<AutoBattleSettings>) => void;
  onMeditate: () => void;
  onBuyElixir: () => void;
  onLeaveMine: () => void;
}

const damageTypeLabel = (type?: Monster['damageType']) => type === 'magic' ? 'Магический урон' : type === 'physical' ? 'Физический урон' : type ? `Урон: ${type}` : 'Тип урона неизвестен';

export const HuntDashboard: React.FC<HuntDashboardProps> = ({
  player, currentRegion, regionMonsters, selectedMonster, activeMod, selectedLock, progress, energyError, combatEnergyCost,
  autoBattle, isSettingsOpen, premiumActive, elixirPrice, getMonsterLock, onSelectMonster, onStartHunt, onToggleSettings,
  onUpdateAutoBattle, onMeditate, onBuyElixir, onLeaveMine
}) => {
  const scene = getBattleScene(currentRegion.id, currentRegion.id);
  const loot = selectedMonster?.drops.filter(drop => drop.type === 'material').slice(0, 2) || [];
  const needsLevel = player.level < currentRegion.minLevel;
  const isMiningLocked = Boolean(player.miningExpedition && !premiumActive);
  const canStart = Boolean(selectedMonster) && !selectedLock && !needsLevel && !isMiningLocked;

  return <FolioPage className="hunt-folio">
    <section className="hunt-region-banner" aria-label="Поточний регіон">
      <div className="hunt-region-backdrop"><BattleBackdrop scene={scene} /></div>
      <div className="hunt-region-shade" />
      <div className="hunt-region-content">
        <div className="hunt-region-kicker"><RpgIcon kind="bestiary" size={17} /> Польовий журнал мисливця</div>
        <div className="hunt-region-heading">
          <div>
            <h1 className="folio-title">{currentRegion.name.split(':')[0]}</h1>
            <div className="hunt-region-meta">
              <span className="hunt-region-modifier">{activeMod.name}</span>
              <span>Мисливець · Ур. {player.level}</span>
              <span>{regionMonsters.length} слідів</span>
            </div>
          </div>
          <span className="hunt-region-level"><RpgIcon kind="map" size={15} /> Рівні {currentRegion.levelRange}</span>
        </div>
      </div>
    </section>

    <div className="bestiary-spread">
      <BestiaryPanel className="bestiary-index">
        <div className="bestiary-index-heading">
          <SectionTitle eyebrow="Покажчик регіону">Сліди істот</SectionTitle>
          <RpgIconButton icon="settings" label="Настройки автобоя" onClick={onToggleSettings} />
        </div>
        <div className="bestiary-list">
          {regionMonsters.map(monster => {
            const locked = Boolean(getMonsterLock(monster));
            const marker = monster.isBoss ? 'Босс' : monster.isElite ? 'Элита' : undefined;
            return <BestiaryEntry key={monster.id} title={monster.name} subtitle={`Ур. ${monster.level}`} image={getMonsterArtworkPath(monster.id, monster.avatar)} selected={monster.id === selectedMonster?.id} locked={locked} marker={marker} onClick={() => onSelectMonster(monster.id)} />;
          })}
          {regionMonsters.length === 0 && <p className="bestiary-empty-note">У цьому регіоні поки немає записаних істот.</p>}
        </div>
        <div className="bestiary-index-progress">
          <OrnamentDivider />
          <div className="bestiary-progress-row">
            <div><div className="bestiary-progress-label"><span>Следы</span><span>{Math.min(6, progress.kills)}/6</span></div><div className="progress-track h-1.5"><div className="progress-fill is-energy" style={{ width: `${Math.min(100, progress.kills / 6 * 100)}%` }} /></div></div>
            <div><div className="bestiary-progress-label"><span>Элиты</span><span>{Math.min(2, progress.eliteWins)}/2</span></div><div className="progress-track h-1.5"><div className="progress-fill is-energy" style={{ width: `${Math.min(100, progress.eliteWins / 2 * 100)}%` }} /></div></div>
            <div><div className="bestiary-progress-label"><span>Босс</span><span>{progress.bossWins ? 'Готово' : '0/1'}</span></div><div className="progress-track h-1.5"><div className="progress-fill is-energy" style={{ width: `${progress.bossWins ? 100 : 0}%` }} /></div></div>
          </div>
        </div>
      </BestiaryPanel>

      <section className="bestiary-illustration" aria-label={selectedMonster ? `Ілюстрація: ${selectedMonster.name}` : 'Ілюстрація істоти'}>
        <div className="bestiary-illustration-paper" />
        <div className="bestiary-illustration-wash" />
        <div className="bestiary-illustration-top"><span className="bestiary-art-stamp"><RpgIcon kind="bestiary" size={16} /> Гравюра польового атласу</span></div>
        {selectedMonster
          ? <img src={getMonsterArtworkPath(selectedMonster.id, selectedMonster.avatar)} alt={selectedMonster.name} className="bestiary-monster-art" referrerPolicy="no-referrer" />
          : <div className="bestiary-illustration-empty"><RpgIcon kind="monster" size={42} /><span>Оберіть істоту з покажчика</span></div>}
        <div className="bestiary-illustration-caption"><span>{currentRegion.name.split(':')[0]}</span><i aria-hidden="true" /></div>
      </section>

      {selectedMonster ? <ParchmentPanel className="bestiary-dossier">
        <div className="bestiary-dossier-heading">
          <div className="bestiary-dossier-seal"><RpgIcon kind="bestiary" size={23} /></div>
          <div className="min-w-0">
            <div className="bestiary-dossier-eyebrow">Досье істоти</div>
            <h2 className="bestiary-dossier-name">{selectedMonster.name}</h2>
          </div>
        </div>
        <div className="bestiary-dossier-tags">
          <span>Рівень {selectedMonster.level}</span>
          {selectedMonster.isBoss && <span className="is-boss">Босс</span>}
          {selectedMonster.isElite && <span>Элита</span>}
          <span>{damageTypeLabel(selectedMonster.damageType)}</span>
        </div>
        <OrnamentDivider className="bestiary-ink-divider" />
        <div className="bestiary-dossier-stats">
          <StatRow label="Здоровье" value={selectedMonster.maxHp.toLocaleString()} tone="hp" />
          <StatRow label="Атака" value={selectedMonster.attack.toLocaleString()} />
        </div>
        <div className="bestiary-habitat"><RpgIcon kind="map" size={17} /><span><small>Місце зустрічі</small><strong>{currentRegion.name}</strong></span></div>
        <div className="bestiary-loot">
          <div className="bestiary-section-label">Находки</div>
          <div className="bestiary-loot-list">
            {loot.length ? loot.map(drop => <span key={`${selectedMonster.id}-${drop.itemName}`}>{drop.itemName}</span>) : <span className="is-empty">Следов добычи пока нет</span>}
          </div>
        </div>
      </ParchmentPanel> : <ParchmentPanel className="bestiary-dossier bestiary-dossier-empty"><div>Оберіть істоту, щоб відкрити її запис.</div></ParchmentPanel>}
    </div>

    <div className="hunt-controls">
      <div className="hunt-alerts">
        {isMiningLocked && <BestiaryPanel className="hunt-notice">
          <div className="flex items-center gap-2 text-xs text-[#d1ad67]"><RpgIcon kind="mine" size={19} /><span>Герой на шахтній експедиції</span></div>
          <button onClick={onLeaveMine} className="rpg-button rpg-button-secondary shrink-0 px-3 text-xs">Вернуться</button>
        </BestiaryPanel>}
        {energyError && <BestiaryPanel className="hunt-energy-error" role="status" aria-live="polite">
          <div className="flex items-start gap-2 text-xs text-[#e1b7b3]"><span aria-hidden="true" className="hunt-warning-mark">!</span><span>{energyError}</span></div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onMeditate} className="rpg-button rpg-button-secondary min-h-11 px-2 text-[11px]">Медитация +10</button>
            <button onClick={onBuyElixir} disabled={player.silver < elixirPrice || player.energy >= player.maxEnergy} className="rpg-button rpg-button-secondary min-h-11 px-2 text-[11px]">Эликсир +30 · {elixirPrice} серебра</button>
          </div>
        </BestiaryPanel>}
      </div>
      <div className="hunt-action-area">
        <RpgButton variant="primary" icon="hunt" disabled={!canStart} onClick={onStartHunt} className="hunt-action-button w-full text-sm uppercase tracking-[.08em]">
          Начать охоту <span className="font-mono text-[11px] font-semibold">· {combatEnergyCost} энергии</span>
        </RpgButton>
        {selectedLock && <p className="hunt-action-note">{selectedLock}</p>}
        {needsLevel && <p className="hunt-action-note">Для этой области нужен уровень {currentRegion.minLevel}.</p>}
      </div>
    </div>

    {isSettingsOpen && <BestiaryPanel className="hunt-settings">
      <div className="flex items-center justify-between"><h3 className="section-title text-sm">Настройки автобоя</h3><button onClick={onToggleSettings} className="min-h-11 px-2 text-xs text-[#aaa49a]">Закрыть</button></div>
      <label className="flex min-h-11 items-center justify-between gap-3 text-xs text-[#c5c0b6]"><span>Использовать навыки</span><input type="checkbox" checked={autoBattle.useSkills} onChange={event => onUpdateAutoBattle({ useSkills: event.target.checked })} className="h-5 w-5 accent-[#b99558]" /></label>
      <label className="flex items-center justify-between text-xs text-[#c5c0b6]"><span>Автозелье при HP ниже</span><span className="font-mono text-[#d1ad67]">{autoBattle.healAtHpPercent}%</span></label>
      <input type="range" min="20" max="70" value={autoBattle.healAtHpPercent} onChange={event => onUpdateAutoBattle({ healAtHpPercent: Number(event.target.value) })} aria-label="Порог автозелья по здоровью" className="w-full accent-[#b99558]" />
    </BestiaryPanel>}
  </FolioPage>;
};
