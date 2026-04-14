import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
          justifyContent:"center", flexDirection:"column", gap:"1rem",
          background:"var(--bg-app, #0f0f0f)", textAlign:"center", padding:"2rem" }}>
          <div style={{ fontSize:"2rem" }}>⚠️</div>
          <p style={{ color:"var(--text-primary, #fff)", fontWeight:500, fontSize:"1rem" }}>
            Something went wrong
          </p>
          <p style={{ color:"var(--text-muted, #888)", fontSize:"0.8rem" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.5rem" }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ padding:"0.5rem 1.25rem", borderRadius:8, border:"none",
                background:"var(--accent, #6366f1)", color:"#fff",
                cursor:"pointer", fontSize:"0.8rem", fontWeight:500 }}>
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding:"0.5rem 1.25rem", borderRadius:8,
                border:"0.5px solid var(--border, #333)",
                background:"transparent", color:"var(--text-muted, #888)",
                cursor:"pointer", fontSize:"0.8rem" }}>
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;