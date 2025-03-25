import { useState, useEffect } from "react";

/**
 * 주어진 값에 디바운스를 적용하는 커스텀 리액트 훅입니다.
 *
 * @template T - 디바운스를 적용할 값의 타입 (제네릭)
 * @param value - 디바운스를 적용할 값입니다. 이 값이 변경되면 지정된 지연 시간 이후에만 업데이트됩니다.
 * @param delay - 디바운스 지연 시간 (ms)
 * @returns - 지연시간 이후에 반영된 디바운스된 값
 *
 * @example
 * const [state, setState] = useState("");
 * const debounceState = useDebouncedValue(state, 300);
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
