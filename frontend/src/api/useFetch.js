// Tiny `useFetch` hook for components. Re-runs whenever any value in `deps`
// changes, aborts in-flight requests on unmount or dep change, and returns
// `{ data, error, loading }`.

import { useEffect, useState } from "react";

export function useFetch(fetcher, deps = []) {
    const [state, setState] = useState({ data: null, error: null, loading: true });

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;

        setState((s) => ({ ...s, loading: true, error: null }));

        Promise.resolve(fetcher({ signal: controller.signal }))
            .then((data) => {
                if (cancelled) return;
                setState({ data, error: null, loading: false });
            })
            .catch((error) => {
                if (cancelled || error.name === "AbortError") return;
                setState({ data: null, error, loading: false });
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}

export default useFetch;
