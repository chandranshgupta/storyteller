
export function QueenChessPieceIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 45 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M8 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M20.5 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M33 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M22.5 11.5s4-6.5 2.5-9.5c0 0-2-2-2.5-2s-2.5 2-2.5 2c-1.5 3 2.5 9.5 2.5 9.5" />
            <path d="M12.5 37.5h20l-4.5-5h-11l-4.5 5z" />
            <path d="M12.5 37.5l4.5-12.5h11l4.5 12.5" />
        </svg>
    );
}
