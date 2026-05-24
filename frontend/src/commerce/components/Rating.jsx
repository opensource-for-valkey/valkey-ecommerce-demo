import { Star } from "@phosphor-icons/react";

export const Rating = ({ value, count }) => (
  <div className="vc-rating" aria-label={`${value} stars`}>
    <Star size={16} weight="fill" />
    <strong>{Number(value).toFixed(1)}</strong>
    {count !== undefined && <span>({count.toLocaleString()})</span>}
  </div>
);

