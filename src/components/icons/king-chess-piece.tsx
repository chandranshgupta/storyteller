
export function KingChessPieceIcon({ className }: { className?: string }) {
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
            <path d="M22.5 11.63V6M20 8h5" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1.5-3-3-3s-3 3-3 3c-1.5 3 3 10.5 3 10.5" />
            <path d="M12.5 37.5h20l-4.5-5h-11l-4.5 5z" />
            <path d="M12.5 37.5l4.5-12.5h11l4.5 12.5" />
        </svg>
    );
}
