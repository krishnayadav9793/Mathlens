import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

const MatrixCellInput = memo(function MatrixCellInput({
  value,
  row,
  col,
  channel,
  isHovered,
  isCompact,
  onChange,
  onHover
}) {
  const [text, setText] = useState(String(value));
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setText(String(value));
    }
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setText(raw);
    if (raw !== '') {
      const num = Math.min(255, Math.max(0, parseInt(raw, 10)));
      onChange && onChange({ row, col, channel, value: num });
    }
  };

  const handleFocus = (e) => {
    isFocusedRef.current = true;
    onHover && onHover();
    e.target.select();
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    let finalVal = 0;
    if (text !== '') {
      const parsed = parseInt(text, 10);
      if (!isNaN(parsed)) {
        finalVal = Math.min(255, Math.max(0, parsed));
      }
    }
    setText(String(finalVal));
    onChange && onChange({ row, col, channel, value: finalVal });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = text === '' ? 0 : (parseInt(text, 10) || 0);
      const step = e.shiftKey ? 10 : 1;
      const next = Math.min(255, current + step);
      setText(String(next));
      onChange && onChange({ row, col, channel, value: next });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = text === '' ? 0 : (parseInt(text, 10) || 0);
      const step = e.shiftKey ? 10 : 1;
      const next = Math.max(0, current - step);
      setText(String(next));
      onChange && onChange({ row, col, channel, value: next });
    } else if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div
      className={`matrix-cell ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={onHover}
      onTouchStart={onHover}
      style={{
        borderColor: isHovered ? 'var(--accent-primary)' : 'var(--border-color)',
        borderRadius: isCompact ? '7px' : '9px',
        width: isCompact ? '46px' : '56px',
        height: isCompact ? '46px' : '56px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isHovered ? 'var(--bg-hover)' : 'var(--bg-secondary)',
        boxShadow: isHovered
          ? '0 0 0 1.5px var(--accent-primary, #697951), 0 3px 10px rgba(0, 0, 0, 0.45)'
          : '0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="matrix-cell-input"
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: isCompact ? '0.94rem' : '1.1rem',
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          cursor: 'pointer'
        }}
        aria-label={`${channel.toUpperCase()} cell [${row}, ${col}]`}
      />
    </div>
  );
});

export default function RGBExplodedView({
  colorGrid,
  activeTab = 'all',
  hoveredCell,
  onHoverCell,
  onChangeCell
}) {
  const rMatrix = useMemo(() => (colorGrid ? colorGrid.map(row => row.map(p => p.r)) : []), [colorGrid]);
  const gMatrix = useMemo(() => (colorGrid ? colorGrid.map(row => row.map(p => p.g)) : []), [colorGrid]);
  const bMatrix = useMemo(() => (colorGrid ? colorGrid.map(row => row.map(p => p.b)) : []), [colorGrid]);

  const channelConfig = useMemo(() => ({
    r: {
      key: 'r',
      name: 'Red Channel',
      symbol: 'M_R',
      matrix: rMatrix
    },
    g: {
      key: 'g',
      name: 'Green Channel',
      symbol: 'M_G',
      matrix: gMatrix
    },
    b: {
      key: 'b',
      name: 'Blue Channel',
      symbol: 'M_B',
      matrix: bMatrix
    }
  }), [rMatrix, gMatrix, bMatrix]);

  if (!colorGrid) return null;

  const renderMatrixGrid = (cfg, isCompact = false) => {
    const { key, matrix } = cfg;

    return (
      <div
        className="rgb-plane-matrix-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isCompact ? '240px' : '340px',
          margin: '0 auto'
        }}
      >
        {/* Plane sub-header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            marginBottom: '0.55rem',
            width: '100%'
          }}
        >
          <span
            style={{
              fontSize: isCompact ? '0.86rem' : '1.02rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            {cfg.name} <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>({cfg.symbol})</span>
          </span>
        </div>

        {/* Matrix Bracket Container */}
        <div
          className="matrix-bracket-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            margin: 0
          }}
        >
          <div
            className="matrix-left-bracket"
            style={{
              borderColor: 'var(--border-color)',
              borderRight: 'none',
              borderRadius: '7px 0 0 7px',
              width: '7px',
              alignSelf: 'stretch',
              borderWidth: '2.5px',
              borderStyle: 'solid',
              marginRight: '5px'
            }}
          />
          <div
            className="matrix-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: isCompact ? '5px' : '7px',
              width: 'fit-content'
            }}
          >
            {matrix.map((rowArr, i) =>
              rowArr.map((val, j) => {
                const isHovered = hoveredCell && hoveredCell.row === i && hoveredCell.col === j;
                return (
                  <MatrixCellInput
                    key={`${key}-${i}-${j}`}
                    value={val}
                    row={i}
                    col={j}
                    channel={key}
                    isHovered={isHovered}
                    isCompact={isCompact}
                    onChange={onChangeCell}
                    onHover={() => onHoverCell && onHoverCell({ row: i, col: j })}
                  />
                );
              })
            )}
          </div>
          <div
            className="matrix-right-bracket"
            style={{
              borderColor: 'var(--border-color)',
              borderLeft: 'none',
              borderRadius: '0 7px 7px 0',
              width: '7px',
              alignSelf: 'stretch',
              borderWidth: '2.5px',
              borderStyle: 'solid',
              marginLeft: '5px'
            }}
          />
        </div>
      </div>
    );
  };

  const hoveredPixel = hoveredCell ? colorGrid[hoveredCell.row]?.[hoveredCell.col] : null;

  return (
    <div
      className="matrix-grid-card glass-level-2"
      onMouseLeave={() => onHoverCell && onHoverCell(null)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {/* Card Header */}
        <div
          className="matrix-header"
          style={{
            marginBottom: '0.75rem',
            paddingBottom: '0.45rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
              {activeTab === 'all' ? 'Decomposed Channel Matrices' : `${channelConfig[activeTab]?.name} (${channelConfig[activeTab]?.symbol})`}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {activeTab === 'all' ? 'I = (M_R, M_G, M_B)' : `I[i, j] → ${channelConfig[activeTab]?.symbol}[i, j]`}
          </span>
        </div>

        {/* Single Plane View */}
        {activeTab !== 'all' && channelConfig[activeTab] && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              margin: 'auto 0'
            }}
          >
            {renderMatrixGrid(channelConfig[activeTab], false)}
          </div>
        )}

        {/* All 3 Channels View: Side-by-Side in 1 Row */}
        {activeTab === 'all' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              margin: 'auto 0'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.65rem',
                width: '100%',
                alignItems: 'center',
                justifyItems: 'center'
              }}
            >
              {renderMatrixGrid(channelConfig.r, true)}
              {renderMatrixGrid(channelConfig.g, true)}
              {renderMatrixGrid(channelConfig.b, true)}
            </div>
          </div>
        )}

        {/* Recombination synthesis bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginTop: '0.65rem',
            minHeight: '36px'
          }}
        >
          {hoveredCell && hoveredPixel ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>Pixel [{hoveredCell.row}, {hoveredCell.col}]:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>R={hoveredPixel.r}</span>
              <span style={{ opacity: 0.4 }}>+</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>G={hoveredPixel.g}</span>
              <span style={{ opacity: 0.4 }}>+</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>B={hoveredPixel.b}</span>
              <span style={{ opacity: 0.4 }}>=</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '5px',
                  background: `rgb(${hoveredPixel.r}, ${hoveredPixel.g}, ${hoveredPixel.b})`,
                  color: (hoveredPixel.r * 0.299 + hoveredPixel.g * 0.587 + hoveredPixel.b * 0.114) > 130 ? '#000000' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                RGB({hoveredPixel.r}, {hoveredPixel.g}, {hoveredPixel.b})
              </span>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
              Hover or click any cell to inspect and edit RGB channel intensities
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
