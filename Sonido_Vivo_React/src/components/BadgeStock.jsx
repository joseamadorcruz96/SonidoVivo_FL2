export function BadgeStock({ stock = 0, stockCritico = 2, compacto = false }) {
  const stockNum = Number(stock);
  const criticoNum = Number(stockCritico);

  if (stockNum <= 0) {
    return <span className={`badge bg-danger ${compacto ? 'fs-6 px-2' : ''}`}>{compacto ? '0' : 'Agotado'}</span>;
  }

  if (stockNum <= criticoNum) {
    return (
      <span
        className={`badge bg-warning text-dark fw-semibold ${compacto ? 'fs-6 px-2' : ''}`}
        title="Últimas unidades en inventario"
      >
        {compacto ? stockNum : `⚠️ Stock Crítico (${stockNum} un.)`}
      </span>
    );
  }

  return (
    <span className={`badge bg-success ${compacto ? 'fs-6 px-2' : ''}`}>
      {compacto ? stockNum : `Stock: ${stockNum} un.`}
    </span>
  );
}
