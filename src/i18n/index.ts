import { useCallback, useMemo } from 'react';

import i18n_zh from './zh';

export type LangCode = 'zh';

const useI18N = (lang: string) => {
  const i18n = useMemo(() => {
    if (lang === 'zh') return i18n_zh;
    else return i18n_zh;
  }, [lang]);

  const getTranslation = (obj: any, path: string[]): string | undefined => {
    return path.reduce((acc, key) => acc?.[key], obj);
  };

  const t = useCallback((identify: string) => {
    const identifies = identify.split('.');
    return getTranslation(i18n, identifies) || identify;
  }, [i18n]);

  return { t };
};

export default useI18N;
