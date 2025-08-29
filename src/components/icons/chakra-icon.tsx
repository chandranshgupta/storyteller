export function ChakraIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="22" y1="12" x2="19" y2="12" />
      <line x1="12" y1="22" x2="12" y2="19" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19.07" y1="4.93" x2="16.24" y2="7.76" />
      <line x1="19.07" y1="19.07" x2="16.24" y2="16.24" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    </svg>
  );
}
