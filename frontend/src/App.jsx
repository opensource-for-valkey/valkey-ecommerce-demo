import { BrowserRouter } from "react-router-dom";
import { CommerceApp } from "./commerce/CommerceApp";
import RouteScrollToTop from "./commerce/components/RouteScrollToTop";
import { CommerceProvider } from "./commerce/CommerceContext";
import { ErrorBoundary } from "./commerce/ErrorBoundary";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteScrollToTop />
      <ErrorBoundary>
        <CommerceProvider>
          <CommerceApp />
        </CommerceProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
