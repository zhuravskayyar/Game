> ІСТОРИЧНИЙ ПЛАН. Desktop-композицію скасовано користувачем 02.10.2026. Актуальні правила: тільки мобільний Telegram Mini App; див. HERO_UI_ASSEMBLY.md і ../AGENTS.md. Не використовувати цей документ як візуальний орієнтир.

# Bestiary UI asset plan

## UI audit

- `src/App.tsx` owns the shared shell and tab state. It renders `TopHeader`, one screen inside `<main>`, then `BottomNavigation` and shared modals.
- `src/context/GameContext.tsx` and `src/components/combat/CombatScreen.tsx` own game state and battle actions. `HuntDashboard` receives selected data and callbacks, so its composition can change without moving domain behavior.
- Most screens are already separate components. Shared visual primitives live in `src/components/ui/BestiaryUI.tsx`; the visual tokens and page materials live in `src/index.css`.
- The current shell and several screens are constrained to `max-w-lg`. Hunt is a vertical stack of a location banner, a creature-list panel, a dossier panel, and a full-width action. On desktop this leaves the scene narrow and makes the repeated panels read like a mobile web app.
- Responsive rules currently focus on small phones (notably 380px); there is no desktop or tablet spread composition.
- No repository-level `AGENTS.md` was found under `Game/`. The user-provided project instructions remain in force.

## New hierarchy

1. **Book shell:** full-height dark leather surround with a broad framed reading area.
2. **Hunter's HUD:** compact character, level/progress, gold, and energy on the top rail.
3. **Open chapter:** the selected game screen in a single wide page area.
4. **Chapter bookmarks:** the existing four primary destinations as physical-looking tabs; secondary destinations remain in the existing accessible drawer.
5. **Bestiary spread:** region folio at the top; creature index on the left; selected monster illustration in the center; factual dossier on the right; hunt action attached to the bottom edge.

At desktop the bestiary uses three columns. At tablet width the index stays beside a two-part detail area. On mobile the index becomes a compact horizontally scrollable bookmark strip, followed by the illustration and dossier in a single column. Mobile can scroll within the screen while the shared navigation remains available.

## Existing assets: keep / restyle / regenerate

| Existing asset group | Decision | Use |
| --- | --- | --- |
| `public/assets/sprites/generated/monsters/*.webp` (19 authored monster portraits plus manifest aliases) | **KEEP + RESTYLE** | Keep all authored portraits and alias logic. Present them over location art with an ink vignette and paper mat; do not regenerate them for this pass. |
| `src/assets/battle/*.webp` (plains, woods, forest, crypt, swamp, desert, cursed, rift, mountain, cave, mine, spider, catacombs, cave-rift, cave-dragon, arena) | **KEEP** | Existing scene mapping remains authoritative. Use location backgrounds as atmosphere, not as the monster portrait itself. |
| `public/assets/sprites/generated/ui/icons/*.webp` | **KEEP** | Reuse existing RPG pictograms in HUD, tabs, markers, and controls. No emoji or replacement icon set. |
| `public/assets/sprites/generated/ui/gear/*.webp` and `resources/*.webp` | **KEEP** | Continue to use in inventory and crafting screens. |
| `public/assets/sprites/generated/heroes/*.webp` | **KEEP** | Existing class portraits remain the HUD and character-sheet art. |
| `public/assets/sprites/generated/ui/leather-grain.webp` | **KEEP + RESTYLE** | Retain as a low-opacity repeating material over the dark shell; remove the translucent blurred dashboard treatment. |
| `public/assets/sprites/generated/ui/parchment-grain.webp` | **REGENERATE for parchment surface use** | The current texture has strong red/blue mottling when inspected at source size. Keep the file for any legacy consumers; introduce a calmer reusable parchment tile for the new folio. |
| Existing world/map art | **NONE FOUND** | The repository has a map icon and region/scene data, but no unlabeled world-map base. It is outside this shell/Hunt slice. |
| Stretchable book frame, torn page, corner ornaments, ink separators, physical bookmark art | **NONE FOUND** | Keep CSS limited to layout, ink rules, and modest state effects. A single shared frame and paper tile are the only new raster assets needed for this slice. |

### Inventory of kept artwork

- **Monster portraits:** `m_ash_imp.webp`, `m_bandit.webp`, `m_blood_hound.webp`, `m_boar.webp`, `m_cursed_soldier.webp`, `m_death_knight_boss.webp`, `m_demon_lord.webp`, `m_dragon_boss.webp`, `m_goblin.webp`, `m_peak_guard.webp`, `m_queen_bat.webp`, `m_rift_drake.webp`, `m_sand_guard.webp`, `m_sand_scorpion.webp`, `m_scale_hunter.webp`, `m_spider.webp`, `m_spider_queen.webp`, `m_stone_golem.webp`, `m_wolf.webp`.
- **Battle scenes:** `arena.webp`, `cave-bat.webp`, `cave-dragon.webp`, `cave-rift.webp`, `catacombs.webp`, `crypt.webp`, `cursed.webp`, `desert.webp`, `forest.webp`, `mine.webp`, `mountain.webp`, `plains.webp`, `rift.webp`, `spider.webp`, `swamp.webp`, `woods.webp`.
- **UI pictograms:** `alchemy.webp`, `arena.webp`, `attack.webp`, `bestiary.webp`, `character.webp`, `clan.webp`, `compass.webp`, `crown.webp`, `defend.webp`, `energy.webp`, `forge.webp`, `gold.webp`, `hp.webp`, `hunt.webp`, `inventory.webp`, `leave.webp`, `map.webp`, `market.webp`, `mine.webp`, `more.webp`, `monster.webp`, `potion.webp`, `quest.webp`, `refresh.webp`, `settings.webp`, `silver.webp`, `skill.webp`, `stamina.webp`.
- **UI materials:** `leather-grain.webp` and the legacy `parchment-grain.webp`.
- **Gear, resource, and hero sprites:** keep all files in their existing generated folders and manifests; the redesign does not alter their identifiers or data mapping.

## New reusable asset manifest

| Filename | Purpose / screen | Dimensions and ratio | Alpha / scaling | Visual description | Generation prompt | Negative constraints |
| --- | --- | --- | --- | --- | --- | --- |
| `public/assets/sprites/generated/ui/book-frame-9slice.webp` | Shared game viewport frame; shell, dialogs, chapter surfaces | 1254×1254 square source; 3×3 nine-slice with a 140px border source inset | Transparent center; stretch edges and corners only via `border-image-slice: 140 fill` (or nine-slice equivalent); corners fixed | Dark, worn oxblood-brown leather rim with restrained aged-brass corner caps and a thin engraved inner rule. The central 78% of the canvas is fully transparent. Border thickness and highlights remain even on all four sides. No text or symbols. | **Production prompt:** Create a production-ready square UI frame asset for a dark fantasy monster-hunter's physical field journal. Orthographic, straight-on view, exactly 1:1 canvas. Design only the outer 11% perimeter as worn dark brown leather with a subtle antique brass inner rule and small restrained brass corner fittings. The center 78% of the canvas must be fully transparent and contain absolutely no pixels or shadows. Make the four corners visually balanced; horizontal and vertical edge bands must be plain, low-detail, and safe to stretch. Keep ornament fully inside the outer 11% border. Muted material colors, fine tangible leather grain, crisp clean alpha edge, premium handcrafted RPG prop. No perspective, no drop shadow outside the frame. | No opaque center; no page/background fill; no text, letters, numbers, logos, watermark, UI controls, icons, oversized buckles, bright gold, neon, glow, gradients, perspective, cast shadow, or corner decorations extending into the stretchable edge. |
| `public/assets/sprites/generated/ui/parchment-surface.webp` | Repeating page stock for dossier, folio surfaces, labels | 1254×1254 square tile | Opaque; fixed-size repeat at about 480px or use as a restrained texture overlay | Warm ivory-ochre parchment, fine fibres and tiny muted imperfections, nearly even luminance with a calm center for readable text. | **Production prompt:** Create a seamless square texture tile for the blank paper of a medieval monster hunter's field journal. Top-down scan of warm ivory and muted ochre parchment, fine visible paper fibres, very subtle aged specks and soft natural variation, evenly lit with no strong directional shadow. Keep the full tile low contrast and uniform so dark brown text stays highly readable anywhere. Edges must tile seamlessly on all sides. No border; no torn edges; no illustration. | No text, handwriting, stains in the center, red/blue color noise, large stains, folds, vignette, high contrast, border, shadow, watermark, logo, UI, or gradients. |

### Usage and nine-slice rules

- Keep the frame's center alpha transparent. Never scale the full frame as a single `<img>`; stretch its edges and retain its corners with CSS nine-slice or separate corner pieces.
- Tile the parchment surface at a restrained scale; put content on it with opaque ink colors and enough contrast. Do not place generated text on either asset.
- Existing region labels, monster names, HP, loot, and buttons remain live UI text rendered from existing data.
- Generate no world map, torn paper, separators, extra location scenes, or replacement monsters in this iteration. Revisit those only with the corresponding screen audit.

## Later screen reuse

The shell, type scale, materials, and bookmark navigation are reusable for World, Hero, Inventory, and Combat. Their internal compositions remain in their current vertical slice for this iteration; they can migrate screen by screen without changing domain components or game behavior.
