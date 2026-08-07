interface TrendPoint {
  label: string;
  revenueKobo: number;
  orders: number;
}

function compactNaira(kobo: number) {
  const naira = kobo / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}m`;
  if (naira >= 1_000) return `₦${Math.round(naira / 1_000)}k`;
  return `₦${Math.round(naira)}`;
}

export function SalesTrendChart({ points }: { points: TrendPoint[] }) {
  const max = Math.max(...points.map(point => point.revenueKobo), 1);
  return (
    <div className="executive-chart" role="img" aria-label="Revenue trend for the last fourteen days">
      <div className="executive-chart-grid" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="executive-chart-bars">
        {points.map(point => {
          const height = Math.max(4, Math.round((point.revenueKobo / max) * 100));
          return (
            <div className="executive-chart-column" key={point.label} title={`${point.label}: ${compactNaira(point.revenueKobo)} from ${point.orders} orders`}>
              <div className="executive-chart-value">{point.revenueKobo ? compactNaira(point.revenueKobo) : ""}</div>
              <div className="executive-chart-track"><span style={{ height: `${height}%` }} /></div>
              <small>{point.label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
