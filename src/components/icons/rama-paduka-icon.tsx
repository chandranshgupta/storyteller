
export function RamaPadukaIcon({ className }: { className?: string }) {
    // A more detailed and definitive representation of Rama's Paduka, inspired by ceremonial golden designs.
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <g transform="translate(4, 2) scale(0.8)">
            {/* Left Paduka */}
            <g>
                {/* Sole Outline */}
                <path d="M12,58 C4,50 2,38 6,20 S12,2 20,2 S32,10 32,28 C32,38 30,52 22,58" strokeWidth="2.5" />
                {/* Toe Knob */}
                <circle cx="24" cy="40" r="5" strokeWidth="2" />
                <path d="M24,35 A2,2 0 0,1 24,35 L26,33 L28,35 L26,37 L24,39 L22,37 L20,35 L22,33 Z" />
            </g>

            {/* Right Paduka */}
            <g transform="translate(32, 0)">
                {/* Sole Outline */}
                <path d="M12,58 C4,50 2,38 6,20 S12,2 20,2 S32,10 32,28 C32,38 30,52 22,58" strokeWidth="2.5" />
                {/* Toe Knob */}
                <circle cx="24" cy="40" r="5" strokeWidth="2" />
                <path d="M24,35 A2,2 0 0,1 24,35 L26,33 L28,35 L26,37 L24,39 L22,37 L20,35 L22,33 Z" />
            </g>
        </g>
      </svg>
    );
  }
  
