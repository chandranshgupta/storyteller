
export function ChakraIcon({ className }: { className?: string }) {
    // A representation of the Sudarshan Chakra
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        dangerouslySetInnerHTML={{ __html: `
        <g>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12,2 L12,5" />
            <path d="M22,12 L19,12" />
            <path d="M12,22 L12,19" />
            <path d="M2,12 L5,12" />
            <path d="M19.07,4.93 L16.24,7.76" />
            <path d="M19.07,19.07 L16.24,16.24" />
            <path d="M4.93,19.07 L7.76,16.24" />
            <path d="M4.93,4.93 L7.76,7.76" />
            <path d="M12,2 L11,3 L12,4 L13,3 L12,2 Z" />
            <path d="M22,12 L21,11 L20,12 L21,13 L22,12 Z" />
            <path d="M12,22 L11,21 L12,20 L13,21 L12,22 Z" />
            <path d="M2,12 L3,11 L4,12 L3,13 L2,12 Z" />
            <path d="M19.07,4.93 L18.36,5.64 L19.07,6.35 L19.78,5.64 Z" />
            <path d="M19.07,19.07 L18.36,18.36 L19.07,17.65 L19.78,18.36 Z" />
            <path d="M4.93,19.07 L5.64,18.36 L4.93,17.65 L4.22,18.36 Z" />
            <path d="M4.93,4.93 L5.64,5.64 L4.93,6.35 L4.22,5.64 Z" />
            <g>
                <circle cx="12" cy="12" r="8" stroke-width="0.5" />
                <defs>
                    <path id="flame" d="M -0.5,0 L 0.5,0 L 0,-1 Z" />
                </defs>
                <g>
                    <use href="#flame" transform="translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(22.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(45, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(67.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(90, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(112.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(135, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(157.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(180, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(202.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(225, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(247.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(270, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(292.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(315, 12, 12) translate(12, 2.2) scale(0.8)" />
                    <use href="#flame" transform="rotate(337.5, 12, 12) translate(12, 2.2) scale(0.8)" />
                </g>
            </g>
        </g>
      `}}
      />
    );
  }
  
