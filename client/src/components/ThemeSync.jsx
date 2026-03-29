import { useEffect } from 'react';
import { useThemeStore, applyThemeToDocument } from '../store/themeStore.js';

/** Keeps <html class="dark"> in sync with persisted theme after React loads. */
export default function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return null;
}
