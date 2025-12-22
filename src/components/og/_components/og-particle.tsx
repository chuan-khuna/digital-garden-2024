interface OGParticleProps {
  particleColor?: string
  lineColor?: string
  particleCount?: number
  width?: number
  height?: number
  seed?: number
}

export default function OGParticle({
  particleColor = '#888888',
  lineColor = '#88888825',
  particleCount = 50,
  width = 1200,
  height = 630,
  seed = 42,
}: OGParticleProps) {
  // Seeded random number generator for consistent output
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  // Generate particles with seeded randomness
  const particles: Array<{ x: number; y: number }> = []
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: seededRandom(seed + i * 2) * width,
      y: seededRandom(seed + i * 2 + 1) * height,
    })
  }

  // Calculate connections between particles
  const connections: Array<{
    x1: number
    y1: number
    x2: number
    y2: number
    opacity: number
  }> = []
  const maxDistance = 150

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const opacity = 1 - distance / maxDistance
        connections.push({
          x1: particles[i].x,
          y1: particles[i].y,
          x2: particles[j].x,
          y2: particles[j].y,
          opacity: opacity * 0.7,
        })
      }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Draw connections first (so they appear behind particles) */}
        {connections.map((conn, index) => (
          <line
            key={`line-${index}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke={lineColor}
            strokeWidth="1"
            opacity={conn.opacity}
          />
        ))}

        {/* Draw particles */}
        {particles.map((particle, index) => (
          <circle
            key={`particle-${index}`}
            cx={particle.x}
            cy={particle.y}
            r="4"
            fill={particleColor}
            opacity="0.7"
          />
        ))}
      </svg>
    </div>
  )
}
