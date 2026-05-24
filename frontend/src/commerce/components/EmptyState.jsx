import { Package } from "@phosphor-icons/react";

export const EmptyState = ({ icon = Package, title, body, action }) => {
  const Icon = icon;
  return (
    <div className="vc-empty">
      <span className="vc-empty__icon">
        <Icon size={30} />
      </span>
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </div>
  );
};

