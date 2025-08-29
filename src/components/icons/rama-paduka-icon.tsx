export function RamaPadukaIcon({ className }: { className?: string }) {
    // This is a simplified representation of Rama's Paduka (sandals)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        dangerouslySetInnerHTML={{ __html: `
        <g>
          <path d="M24,58 C26,55 27,48 26,42 C25,36 22,30 20,28 C18,26 15,28 14,32 C13,36 15,45 18,52 C21,59 22,61 24,58 Z" />
          <path d="M19,38 A3,3 0 0,1 25,38 A3,3 0 0,1 19,38" />
          <path d="M44,58 C46,55 47,48 46,42 C45,36 42,30 40,28 C38,26 35,28 34,32 C33,36 35,45 38,52 C41,59 42,61 44,58 Z" />
          <path d="M39,38 A3,3 0 0,1 45,38 A3,3 0 0,1 39,38" />
        </g>
      `}}
      />
    );
  }
  