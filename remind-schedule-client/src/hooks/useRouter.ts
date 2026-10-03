import { useMemo } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

/**
 * Hook useRouter mang phong cách Next.js (next/router) vào dự án React SPA
 * Cung cấp các phương thức điều hướng quen thuộc: router.push(), router.replace(), router.back(), router.pathname, router.query, router.params
 */
export function useRouter<
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<T>();
  const [searchParams] = useSearchParams();

  // Tổng hợp cả URL params (:id) và Query string (?key=val) tương tự Next.js router.query
  const query = useMemo(() => {
    const combined: Record<string, string> = { ...(params as Record<string, string>) };
    searchParams.forEach((value, key) => {
      combined[key] = value;
    });
    return combined;
  }, [params, searchParams]);

  return useMemo(
    () => ({
      pathname: location.pathname,
      query,
      params,
      push: (url: string) => navigate(url),
      replace: (url: string) => navigate(url, { replace: true }),
      back: () => navigate(-1),
      forward: () => navigate(1),
    }),
    [location.pathname, query, params, navigate],
  );
}

export default useRouter;
