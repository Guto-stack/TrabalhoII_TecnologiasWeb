export function Logo({ className = "w-35 h-35" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="72" fill="#E96B12" stroke="#3F6B3B" strokeWidth="6" />

      <path
        d="M100 72
           C81 72 68 85 68 102
           C68 122 90 134 100 148
           C110 134 132 122 132 102
           C132 85 119 72 100 72Z"
        fill="#102415"
      />

      <path
        d="M100 82
           L106 96
           L121 96
           L109 105
           L114 120
           L100 111
           L86 120
           L91 105
           L79 96
           L94 96Z"
        fill="#F4E5B0"
      />
    </svg>
  );
}