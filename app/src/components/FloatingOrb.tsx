export default function FloatingOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Orb A */}
      <div
        className="absolute rounded-full animate-orb-float"
        style={{
          width: 600,
          height: 600,
          top: -100,
          left: -150,
          background: `radial-gradient(circle, var(--orb-color-1) 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      {/* Orb B */}
      <div
        className="absolute rounded-full animate-orb-float-fast"
        style={{
          width: 400,
          height: 400,
          top: 200,
          right: -100,
          background: `radial-gradient(circle, var(--orb-color-2) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animationDelay: '-5s',
        }}
      />
      {/* Orb C */}
      <div
        className="absolute rounded-full animate-orb-float-slow"
        style={{
          width: 300,
          height: 300,
          bottom: 0,
          left: '30%',
          background: `radial-gradient(circle, var(--orb-color-3) 0%, transparent 70%)`,
          filter: 'blur(100px)',
          animationDelay: '-8s',
        }}
      />
    </div>
  );
}
