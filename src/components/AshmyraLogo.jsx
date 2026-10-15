import React from 'react';

export const AshmyraEmblem = ({ size = 38 }) => (
  <div 
    style={{ 
      width: size, 
      height: size, 
      borderRadius: '10px', 
      overflow: 'hidden', 
      flexShrink: 0,
      border: '1px solid rgba(6, 182, 212, 0.35)',
      boxShadow: '0 0 14px rgba(6, 182, 212, 0.22)',
      background: '#040711',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <img 
      src="/ashmyra-emblem.jpeg" 
      alt="Ashmyra Technologies Emblem" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover',
        display: 'block'
      }}
      onError={(e) => {
        // Fallback to inline SVG if image fails
        e.target.style.display = 'none';
      }}
    />
  </div>
);

export const AshmyraFullLogo = ({ maxHeight = 68, className = '' }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px' }} className={className}>
    <img 
      src="/ashmyra-logo.jpeg" 
      alt="Ashmyra Technologies" 
      style={{ 
        maxHeight: `${maxHeight}px`, 
        width: 'auto', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        display: 'block'
      }} 
    />
  </div>
);

export const AshmyraLogo = ({ size = 'medium', showTagline = true, showAttribution = false }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const emblemSize = isSmall ? 32 : isLarge ? 48 : 38;
  const titleSize = isSmall ? '1.1rem' : isLarge ? '1.75rem' : '1.3rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '10px' : '12px' }}>
      <AshmyraEmblem size={emblemSize} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ 
            fontSize: titleSize, 
            fontWeight: 800, 
            letterSpacing: '-0.025em',
            color: '#f8fafc',
            lineHeight: 1.15
          }}>
            Ashmyra <span className="gradient-text">MailFlow</span>
          </span>
        </div>
        {showTagline && (
          <span style={{ 
            fontSize: isSmall ? '0.68rem' : '0.74rem', 
            color: 'var(--text-muted)', 
            letterSpacing: '0.04em',
            marginTop: '2px',
            fontWeight: 500
          }}>
            Create. Schedule. Send. Measure.
          </span>
        )}
        {showAttribution && (
          <span style={{ 
            fontSize: '0.68rem', 
            color: 'var(--text-dim)', 
            letterSpacing: '0.02em',
            marginTop: '1px'
          }}>
            A Product by Ashmyra Technologies
          </span>
        )}
      </div>
    </div>
  );
};

export default AshmyraLogo;
