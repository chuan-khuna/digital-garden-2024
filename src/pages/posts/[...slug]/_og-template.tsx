// @ts-nocheck
import React from 'react';

interface TemplateProps {
  title: string;
  stage?: 'seedling' | 'budding' | 'evergreen';
  tags?: string[];
  date?: string;
}

const getStageEmoji = (stage?: string) => {
  switch (stage) {
    case 'seedling':
      return '🌱';
    case 'budding':
      return '🌿';
    case 'evergreen':
      return '🌲';
    default:
      return '📝';
  }
};

const template = ({ title, stage, tags, date }: TemplateProps) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.03) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.03) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Header section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Site branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          <span style={{ fontSize: '32px' }}>🌿</span>
          <span>Digital Garden</span>
        </div>

        {/* Stage indicator */}
        {stage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '20px',
              color: '#666',
            }}
          >
            <span style={{ fontSize: '28px' }}>{getStageEmoji(stage)}</span>
            <span style={{ textTransform: 'capitalize' }}>{stage}</span>
          </div>
        )}
      </div>

      {/* Title section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            fontWeight: '700',
            lineHeight: '1.2',
            color: '#111',
            margin: 0,
            maxWidth: '90%',
          }}
        >
          {title}
        </h1>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#555',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontWeight: '500',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {date && (
          <div
            style={{
              fontSize: '18px',
              color: '#888',
            }}
          >
            {date}
          </div>
        )}
        <div
          style={{
            fontSize: '18px',
            color: '#888',
            marginLeft: 'auto',
          }}
        >
          🔗 altr.fyi
        </div>
      </div>
    </div>
  );
};

export default template;