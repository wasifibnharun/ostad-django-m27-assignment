export default function Skeleton({ width = '100%', height = '20px', borderRadius = '14px', style = {} }) {
  return (
    <div 
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style
      }}
    />
  );
}