import { Link } from "react-router-dom";
import { ListChecks } from "@phosphor-icons/react";
import { EmptyState } from "../components/EmptyState";
import { useSeo } from "../useSeo";

export const ContentPage = ({ title, body, icon: Icon = ListChecks }) => {
  useSeo(title, body);
  return (
    <main className="vc-page vc-page--center">
      <EmptyState
        icon={Icon}
        title={title}
        body={body}
        action={<Link className="vc-button vc-button--primary" to="/shop">Explore shop</Link>}
      />
    </main>
  );
};

