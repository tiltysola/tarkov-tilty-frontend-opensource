import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

const Index = () => {
  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  return (
    <div className="im-title">
      <span>{t('interactive.title')}</span>
    </div>
  );
};

export default Index;
