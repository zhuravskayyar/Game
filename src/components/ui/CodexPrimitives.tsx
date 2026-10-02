import React from 'react';
import './CodexPrimitives.css';

const paperParts = ['tl', 'top', 'tr', 'left', 'fill', 'right', 'bl', 'bottom', 'br'];

/** Decorative layer only: content and controls remain ordinary HTML. */
export const ParchmentSkin: React.FC = () => (
  <span className="codex-paper-skin" aria-hidden="true">
    {paperParts.map(part => <span key={part} className={`codex-paper-part codex-paper-${part}`} />)}
  </span>
);

export const SectionRibbon: React.FC<{
  title: string;
  id?: string;
  className?: string;
  level?: 1 | 2 | 3;
}> = ({ title, id, className = '', level = 2 }) => {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Heading id={id} className={`codex-ribbon ${className}`}>
    <span className="codex-ribbon-skin" aria-hidden="true">
      <span className="codex-ribbon-left" />
      <span className="codex-ribbon-center" />
      <span className="codex-ribbon-right" />
    </span>
    <span className="codex-ribbon-title">{title}</span>
  </Heading>;
};

/** No action or icon is baked into the shared tile. */
export const SquareTile: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = '', ...props }) => (
  <span className={`codex-square-tile ${className}`} {...props}>{children}</span>
);

export const SquareButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`codex-square-button ${className}`} {...props}>
    <SquareTile>{children}</SquareTile>
  </button>
);
