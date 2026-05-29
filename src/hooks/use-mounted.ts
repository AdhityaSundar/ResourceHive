"use client";

import { useSyncExternalStore } from "react";

export function useMounted() {
  return useSyncExternalStore(
    (onStoreChange) => {
      queueMicrotask(onStoreChange);
      return () => {};
    },
    () => true,
    () => false,
  );
}
