
export function chakraIcon({ className }: { className?: string }): string {
    // A definitive, symbolic representation of the Sudarshana Chakra,
    // inspired by traditional iconography and user-provided analysis.
    // This design emphasizes its key features: the central hub, concentric rings,
    // radiating spokes, and the iconic serrated, flame-like outer rim.
    
    // Spokes paths
    const spokes = [...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      return `<line
        key="spoke-${i}"
        x1="12"
        y1="12"
        x2="${12 + 6 * Math.cos(angle)}"
        y2="${12 + 6 * Math.sin(angle)}"
        stroke-width="0.5"
      />`;
    }).join('');

    // Flame paths
    const flames = [...Array(32)].map((_, i) => {
        const angle = (i * 2 * Math.PI) / 32;
        const p1 = { x: 12 + 10 * Math.cos(angle), y: 12 + 10 * Math.sin(angle) };
        const p2 = { x: 12 + 12 * Math.cos(angle + Math.PI / 64), y: 12 + 12 * Math.sin(angle + Math.PI / 64) };
        const p3 = { x: 12 + 10 * Math.cos(angle + Math.PI / 16), y: 12 + 10 * Math.sin(angle + Math.PI / 16) };
        return `<path
            key="flame-${i}"
            d="M ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z"
            fill="currentColor"
            stroke-width="0.25"
          />`;
    }).join('');

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="${className}"
      >
        <g>
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="6" stroke-width="0.5" />
          ${spokes}
          <circle cx="12" cy="12" r="10" />
          <g>${flames}</g>
        </g>
      </svg>
    `;
}
