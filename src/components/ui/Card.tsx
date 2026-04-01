interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className = "",
  padding = true,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
