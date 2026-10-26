import { useState, useEffect } from 'react';

/**
 * Returns price multiplier based on URL search query parameters.
 * - Root URL (no query params or standard query): returns 1.0 (Standard wholesale price)
 * - Discreet URL params (e.g. ?ref=partner, ?v=pro, ?m=sp, ?client=freelance, ?type=partner): returns 1.1 (+10% increased price)
 */
export function getPriceMultiplier(): number {
  return 1.0;
}

/**
 * Checks if current view is in Khách Lẻ / Báo Giá Dịch Vụ mode (?mode=baogia, ?mode=khachle, ?mode=freelance).
 */
export function isFreelanceMode(): boolean {
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get('mode')?.toLowerCase();
  return (
    mode === 'freelance' ||
    mode === 'khachle' ||
    mode === 'baogia' ||
    mode === 'dichvu' ||
    searchParams.has('freelance') ||
    searchParams.has('khachle') ||
    searchParams.has('baogia')
  );
}

export function useIsFreelanceMode(): boolean {
  const [isFreelance, setIsFreelance] = useState<boolean>(isFreelanceMode());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsFreelance(isFreelanceMode());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return isFreelance;
}

/**
 * React Hook that monitors price multiplier from URL search parameters.
 */
export function usePriceMultiplier(): number {
  const [multiplier, setMultiplier] = useState<number>(getPriceMultiplier());

  useEffect(() => {
    const handleLocationChange = () => {
      setMultiplier(getPriceMultiplier());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return multiplier;
}

/**
 * Applies price multiplier and rounds result to nearest thousand (làm tròn đến hàng nghìn gần nhất).
 */
export function applyMultiplier(
  price: number | null | undefined,
  multiplier: number
): number | null {
  if (price === null || price === undefined) return null;
  if (multiplier === 1.0) return price;
  return Math.round((price * multiplier) / 1000) * 1000;
}
