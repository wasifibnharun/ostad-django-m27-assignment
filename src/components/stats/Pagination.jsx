import Button from '../ui/Button';

export default function Pagination({ currentPage, totalPages, onPageChange, onPrefetchNext, onPrefetchPrev }) {
  // Derive page numbers to show (simplified for demo purposes)
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* [REQ-21] queryClient.prefetchQuery on Prev / Next hover */}
      <span onMouseEnter={onPrefetchPrev}>
        <Button 
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{ padding: '0 10px', fontSize: '13px', borderRadius: '8px' }}
        >
          ‹ Prev
        </Button>
      </span>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'primary' : 'secondary'}
          onClick={() => onPageChange(p)}
          style={{ width: '38px', padding: '0', borderRadius: '8px', fontSize: '13px' }}
        >
          {p}
        </Button>
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <span style={{ color: '#64748B' }}>...</span>
      )}
      
      {totalPages > 5 && currentPage < totalPages - 2 && (
        <Button
          variant="secondary"
          onClick={() => onPageChange(totalPages)}
          style={{ width: '38px', padding: '0', borderRadius: '8px', fontSize: '13px' }}
        >
          {totalPages}
        </Button>
      )}

      <span onMouseEnter={onPrefetchNext}>
        <Button 
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{ padding: '0 10px', fontSize: '13px', borderRadius: '8px' }}
        >
          Next ›
        </Button>
      </span>
    </div>
  );
}