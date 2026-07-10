interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

export default function Icon({ name, className = "", filled = false, style }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${filled ? "msym-fill" : ""} ${className}`} style={style}>
      {name}
    </span>
  );
}
