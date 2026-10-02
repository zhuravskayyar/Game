import React, { type CSSProperties } from 'react';
import { useGame } from '../../context/GameContext';
import { CLASSES } from '../../data/gameData';
import type { CharacterAttributes, ItemType } from '../../types/game';
import { TalentTree } from './TalentTree';
import { HeroStats } from './HeroStats';
import { RpgIcon } from '../ui/RpgIcon';
import { FolioPage, ParchmentPanel, ProgressBar } from '../ui/BestiaryUI';
import { SectionRibbon, SquareButton } from '../ui/CodexPrimitives';
import './CharacterScreen.css';

interface CharacterScreenProps {
  onClose?: () => void;
}

type AtlasIconName =
  | 'strength' | 'agility' | 'intelligence' | 'vitality' | 'luck' | 'spirit'
  | 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'hp' | 'mana'
  | 'damageTalent' | 'survivalTalent' | 'classTalent' | 'book' | 'skull' | 'eye';

const ATLAS_POSITION: Record<AtlasIconName, [number, number]> = {
  strength: [0, 0], agility: [1, 0], intelligence: [2, 0], vitality: [3, 0], luck: [4, 0], spirit: [5, 0],
  attack: [0, 1], defense: [2, 1], magicDefense: [3, 1], damageTalent: [1, 1],
  magicAttack: [1, 2], hp: [3, 0], mana: [0, 2], survivalTalent: [2, 1], classTalent: [3, 3], book: [0, 4], skull: [0, 3], eye: [5, 3],
};

const IconAtlas: React.FC<{ name: AtlasIconName; className?: string }> = ({ name, className = '' }) => {
  const [column, row] = ATLAS_POSITION[name];
  const style: CSSProperties & { '--atlas-x': string; '--atlas-y': string } = {
    '--atlas-x': `${column * 20}%`,
    '--atlas-y': `${row * 25}%`,
  };
  return <span aria-hidden="true" className={`hero-atlas-icon hero-atlas-icon-${name} ${className}`} style={style} />;
};

const attributes: Array<{ key: keyof CharacterAttributes; label: string; summary: string; icon: AtlasIconName }> = [
  { key: 'strength', label: 'Сила', summary: 'Физический урон', icon: 'strength' },
  { key: 'agility', label: 'Ловкость', summary: 'Скорость и уклонение', icon: 'agility' },
  { key: 'intelligence', label: 'Интеллект', summary: 'Магия и запас маны', icon: 'intelligence' },
  { key: 'vitality', label: 'Живучесть', summary: 'Здоровье и броня', icon: 'vitality' },
  { key: 'luck', label: 'Удача', summary: 'Редкая добыча и крит', icon: 'luck' },
  { key: 'spirit', label: 'Дух', summary: 'Мана и сопротивление', icon: 'spirit' },
  { key: 'willpower', label: 'Воля', summary: 'Регенерация и стойкость', icon: 'vitality' },
];

const visibleAttributes = attributes.slice(0, 6);
const extraAttributes = attributes.slice(6);

const equipmentSlots: Array<{ type: ItemType; label: string }> = [
  { type: 'helmet', label: 'Шлем' }, { type: 'weapon', label: 'Оружие' }, { type: 'offhand', label: 'Вторая рука' },
  { type: 'armor', label: 'Доспех' }, { type: 'gloves', label: 'Перчатки' }, { type: 'ring', label: 'Кольцо' },
  { type: 'pants', label: 'Поножи' }, { type: 'amulet', label: 'Амулет' }, { type: 'belt', label: 'Пояс' },
  { type: 'boots', label: 'Сапоги' }, { type: 'cloak', label: 'Плащ' }, { type: 'artifact', label: 'Артефакт' },
];

const referenceEquipment: ItemType[] = ['weapon', 'helmet', 'armor', 'ring', 'boots', 'amulet'];
const talentIconByBranch: Record<string, AtlasIconName> = { damage: 'damageTalent', survival: 'survivalTalent', class: 'classTalent', mastery: 'eye', legacy: 'book' };

export const CharacterScreen: React.FC<CharacterScreenProps> = ({ onClose }) => {
  const { player, combatStats, allocateAttribute, premium } = useGame();
  if (!player) return null;

  const classDef = CLASSES[player.classId] || CLASSES.warrior;
  const visibleTalents = player.talents.slice(0, 5);

  return <FolioPage className="hero-screen">
    <section className="hero-profile-card" aria-label="Профиль героя">
      <div className="hero-portrait-frame">
        <img className="hero-portrait" src={classDef.image} alt={`Портрет: ${classDef.name}`} />
        <span className="hero-rank-stamp">Ранг {player.ascension?.rank || 'E'}</span>
      </div>

      <div className="hero-identity-paper">
        <div className="hero-name-row">
          <h1 className="hero-name">{player.name}</h1>
          {onClose && <button type="button" onClick={onClose} aria-label="Закрыть лист персонажа" className="hero-close-button">×</button>}
        </div>
        <div className="hero-class-line">{classDef.name} <span>·</span> Ур. {player.level}</div>
        {premium.active && <div className="hero-premium"><RpgIcon kind="crown" size={13} /> Premium</div>}
        <ProgressBar value={player.exp} max={player.nextExp} tone="energy" label={`До уровня ${player.level + 1}`} className="hero-xp" />
        <div className="hero-quick-stats" aria-label="Краткие показатели героя">
          <div className="hero-quick-stat"><IconAtlas name="attack" /><strong>{player.statPoints}</strong><span>Атрибуты</span></div>
          <div className="hero-quick-stat"><IconAtlas name="book" /><strong>{player.talentPoints}</strong><span>Таланты</span></div>
          <div className="hero-quick-stat"><IconAtlas name="eye" /><strong>{player.miningLevel}/{player.alchemyLevel}</strong><span>Профессии</span></div>
        </div>
      </div>

      <details className="hero-class-note">
        <summary><span className="hero-class-seal" aria-hidden="true"><IconAtlas name="skull" /></span><span>Классовая пассивка — {classDef.passive.name}</span><span className="hero-chevron" aria-hidden="true">›</span></summary>
        <div className="hero-class-description">
          <p>{classDef.description}</p><p>{classDef.passive.description}</p>
          {player.activePet && <div className="hero-pet-note">
            <div><RpgIcon kind="pet" size={20} /><span><small>Питомец героя · Ур. {player.activePet.level}</small><strong>{player.activePet.name}</strong></span></div>
            <p>Пассивный эффект: {player.activePet.passiveBonus}</p>
            {player.activePet.activeSkillName && <p>{player.activePet.activeSkillName} · {player.activePet.activeSkillDesc}</p>}
          </div>}
        </div>
      </details>
    </section>

    <ParchmentPanel surface="tiled" className="hero-dossier-page">
    <section className="hero-paper-section hero-attributes" aria-labelledby="hero-attributes-title">
      <div className="hero-section-heading">
        <SectionRibbon id="hero-attributes-title" title="Характеристики" />
        <div className="hero-section-heading-actions"><span>Свободно: {player.statPoints}</span>{extraAttributes.length > 0 && <details className="hero-inline-details hero-extra-details">
          <summary>Подробнее</summary>
          <div className="hero-extra-attributes">{extraAttributes.map(attribute => <div key={attribute.key} className="hero-extra-attribute">
            <IconAtlas name={attribute.icon} className="hero-attribute-icon" /><span><strong>{attribute.label} · {player.attributes[attribute.key]}</strong><small>{attribute.summary}</small></span>
            <SquareButton disabled={player.statPoints <= 0} onClick={() => allocateAttribute(attribute.key)} aria-label={`Повысить: ${attribute.label}`} className="hero-plus-button"><span aria-hidden="true">+</span></SquareButton>
          </div>)}</div>
        </details>}</div>
      </div>
      <div className="hero-attributes-grid">
        {visibleAttributes.map(attribute => <article key={attribute.key} className="hero-attribute-row">
          <IconAtlas name={attribute.icon} className="hero-attribute-icon" />
          <div className="hero-attribute-copy"><h3>{attribute.label}</h3><p>{attribute.summary}</p></div>
          <strong className="hero-attribute-value">{player.attributes[attribute.key]}</strong>
          <SquareButton disabled={player.statPoints <= 0} onClick={() => allocateAttribute(attribute.key)} aria-label={`Повысить: ${attribute.label}`} className="hero-plus-button"><span aria-hidden="true">+</span></SquareButton>
        </article>)}
      </div>
    </section>

    <section className="hero-paper-section hero-equipment" aria-labelledby="hero-equipment-title">
      <div className="hero-section-heading">
        <SectionRibbon id="hero-equipment-title" title="Снаряжение" />
        <details className="hero-inline-details">
          <summary>Изменить</summary>
          <div className="hero-expanded-list">
            {equipmentSlots.map(slot => <div key={slot.type} className="hero-expanded-item"><RpgIcon kind={slot.type} size={25} /><span><small>{slot.label}</small><strong>{player.equipped[slot.type]?.name || 'Пусто'}</strong></span></div>)}
            {player.equipped.pickaxe && <div className="hero-expanded-item"><RpgIcon kind="pickaxe" size={25} /><span><small>Кирка</small><strong>{player.equipped.pickaxe.name}</strong></span></div>}
            {player.equipped.alchemyTool && <div className="hero-expanded-item"><RpgIcon kind="alchemyTool" size={25} /><span><small>Алхімічний інструмент</small><strong>{player.equipped.alchemyTool.name}</strong></span></div>}
          </div>
        </details>
      </div>
      <div className="hero-equipment-grid">
        {referenceEquipment.map(type => {
          const slot = equipmentSlots.find(item => item.type === type)!;
          const item = player.equipped[type];
          return <div key={type} className={`hero-equipment-slot ${item ? 'has-item' : ''}`} title={`${slot.label}: ${item?.name || 'Пусто'}`}>
            <RpgIcon kind={type} size={34} />
            {item && typeof item.upgradeLevel === 'number' && item.upgradeLevel > 0 && <span className="hero-item-upgrade">+{item.upgradeLevel}</span>}
          </div>;
        })}
      </div>
    </section>

    <section className="hero-paper-section hero-talents" aria-labelledby="hero-talents-title">
      <div className="hero-section-heading">
        <SectionRibbon id="hero-talents-title" title="Таланты" />
        <details className="hero-inline-details hero-talent-details">
          <summary>Все таланты</summary>
          <div className="hero-talent-tree"><TalentTree /></div>
        </details>
      </div>
      <div className="hero-talents-grid">
        {Array.from({ length: 5 }, (_, index) => {
          const talent = visibleTalents[index];
          const icon = talent ? (talentIconByBranch[talent.branch || 'damage'] || 'book') : 'book';
          return <div key={talent?.id || `locked-${index}`} className={`hero-talent-slot ${talent?.currentRank ? 'is-learned' : 'is-locked'}`} title={talent ? `${talent.name} · ${talent.currentRank}/${talent.maxRank}` : 'Закрытый талант'}>
            {talent?.currentRank ? <IconAtlas name={icon} className="hero-talent-icon" /> : <span className="hero-lock-mark" aria-hidden="true" />}
            {talent?.currentRank ? <small>{talent.name}</small> : null}
          </div>;
        })}
      </div>
    </section>

    <section className="hero-paper-section hero-combat" aria-labelledby="hero-combat-title">
      <div className="hero-section-heading">
        <SectionRibbon id="hero-combat-title" title="Боевые показатели" />
        <details className="hero-inline-details hero-combat-details">
          <summary>Подробнее</summary>
          <div className="hero-combat-expanded"><HeroStats stats={combatStats} /></div>
        </details>
      </div>
      <div className="hero-combat-grid">
        <div className="hero-combat-stat"><IconAtlas name="hp" /><span>Здоровье</span><strong>{combatStats.maxHp}</strong></div>
        <div className="hero-combat-stat"><IconAtlas name="mana" /><span>Мана</span><strong>{combatStats.maxMp}</strong></div>
        <div className="hero-combat-stat"><IconAtlas name="attack" /><span>Физ. атака</span><strong>{combatStats.attack}</strong></div>
        <div className="hero-combat-stat"><IconAtlas name="magicAttack" /><span>Маг. атака</span><strong>{combatStats.magicAttack}</strong></div>
        <div className="hero-combat-stat"><IconAtlas name="defense" /><span>Физ. защита</span><strong>{combatStats.defense}</strong></div>
        <div className="hero-combat-stat"><IconAtlas name="magicDefense" /><span>Маг. защита</span><strong>{combatStats.magicDefense}</strong></div>
      </div>
    </section>
    </ParchmentPanel>
  </FolioPage>;
};
