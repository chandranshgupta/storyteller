
export function ChakraIcon({ className }: { className?: string }) {
    // A definitive, symbolic representation of the Sudarshana Chakra,
    // inspired by traditional iconography and user-provided analysis.
    // This design emphasizes its key features: the central hub, concentric rings,
    // radiating spokes, and the iconic serrated, flame-like outer rim.
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <g>
          {/* Central Hub (Nabhi) */}
          <circle cx="12" cy="12" r="1.5" />

          {/* Inner concentric ring */}
          <circle cx="12" cy="12" r="6" strokeWidth="0.5" />

          {/* Radiating Spokes */}
          {[...Array(8)].map((_, i) => (
            <line
              key={`spoke-${i}`}
              x1="12"
              y1="12"
              x2={12 + 6 * Math.cos((i * Math.PI) / 4)}
              y2={12 + 6 * Math.sin((i * Math.PI) / 4)}
              strokeWidth="0.5"
            />
          ))}

          {/* Main outer circle of the body */}
          <circle cx="12" cy="12" r="10" />

          {/* Serrated/Flame-like Rim (Nemi) */}
          <g>
            {[...Array(32)].map((_, i) => {
              const angle = (i * 2 * Math.PI) / 32;
              const angle_deg = i * (360 / 32);
              const p1 = {
                x: 12 + 10 * Math.cos(angle),
                y: 12 + 10 * Math.sin(angle),
              };
              const p2 = {
                x: 12 + 12 * Math.cos(angle + Math.PI / 64),
                y: 12 + 12 * Math.sin(angle + Math.PI / 64),
              };
              const p3 = {
                x: 12 + 10 * Math.cos(angle + Math.PI / 16),
                y: 12 + 10 * Math.sin(angle + Math.PI / 16),
              };

              return (
                <path
                  key={`flame-${i}`}
                  d={`M ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z`}
                  fill="currentColor"
                  strokeWidth="0.25"
                />
              );
            })}
          </g>
        </g>
      </svg>
    );
}
