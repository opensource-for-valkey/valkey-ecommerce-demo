import { money } from "../utils/formatters";

export const SummaryRows = ({ totals }) => (
  <div className="vc-summary-rows">
    <span>Subtotal <strong>{money(totals.subtotal)}</strong></span>
    <span>Discount <strong>-{money(totals.discount)}</strong></span>
    <span>Shipping <strong>{money(totals.shipping)}</strong></span>
    <span>Tax <strong>{money(totals.tax)}</strong></span>
    <span className="total">Total <strong>{money(totals.total)}</strong></span>
  </div>
);

export const Input = ({ label, value, onChange, type = "text" }) => (
  <label className="vc-field">
    {label}
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
  </label>
);

