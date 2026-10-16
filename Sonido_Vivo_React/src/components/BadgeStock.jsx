export function BadgeStock({ stock = 0, stockCritico = 2 }) {
  const stockNum = Number(stock);
  const criticoNum = Number(stockCritico);

  if (stockNum <= 0) {
    return <span className="badge bg-danger">Agotado</span>;
  }

  if (stockNum <= criticoNum) {
    return (
      <span className="badge bg-warning text-dark fw-semibold" title="Últimas unidades en inventario">
        ⚠️ Stock Crítico ({stockNum} un.)
      </span>
    );
  }

  return (
    <span className="badge bg-success">
      Stock: {stockNum} un.
    </span>
  );
}
