import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="vc-page vc-page--center">
          <div className="vc-empty">
            <span className="vc-empty__icon">!</span>
            <h1>Something interrupted the storefront.</h1>
            <p>{this.state.error.message}</p>
            <button className="vc-button vc-button--primary" onClick={() => window.location.reload()}>
              Reload storefront
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

