export default function Button({ 
  children, onClick, variant = 'primary', disabled, className = '', style = {}, ...props 
}) {
  const getStyles = () => {
    const base = {
      height: '38px',
      padding: '0 16px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      opacity: disabled ? 0.5 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      ...style
    };

    if (variant === 'primary') {
      return { ...base, backgroundColor: '#4F46E5', color: '#FFFFFF' };
    }
    if (variant === 'secondary') {
      return { ...base, backgroundColor: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0' };
    }
    if (variant === 'danger') {
      return { ...base, backgroundColor: '#DC2626', color: '#FFFFFF' };
    }
    return base;
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      style={getStyles()} 
      className={className} 
      {...props}
    >
      {children}
    </button>
  );
}