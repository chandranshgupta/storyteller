
export function bowIcon({ className }: { className?: string }): string {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="${className}"
      >
        <g>
            <path d="M3 21c3.12.88 6.5-.41 9-3 2.5-2.59 4.12-6 3-9-1.12-3-4.41-4.62-7-3-2.59 1.62-3.88 5-3 8Z" />
            <path d="M3 21h3" />
            <path d="M12 12v3" />
            <path d="M12 12h-3" />
            <path d="m3 21 9-9" />
        </g>
      </svg>
    `;
  }
  
