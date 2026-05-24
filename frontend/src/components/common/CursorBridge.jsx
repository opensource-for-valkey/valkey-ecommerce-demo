// Bridges the cursor store to React Router. The cursor store fires a global
// 'ai-cursor:navigate' event when the agent wants to change routes; we listen
// and call useNavigate() so we don't have to import the router into Zustand.
//
// Mounted once inside <BrowserRouter> in App.js.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CursorBridge() {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            const path = e.detail?.path;
            if (path) navigate(path);
        };
        window.addEventListener("ai-cursor:navigate", handler);
        return () => window.removeEventListener("ai-cursor:navigate", handler);
    }, [navigate]);

    return null;
}
