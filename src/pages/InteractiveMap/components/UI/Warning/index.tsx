import { useState } from 'react';

import classNames from 'classnames';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

const Index = () => {
  const [show, setShow] = useState(true);

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleCloseModal = () => {
    setShow(false);
  };

  return (
    <div
      className={classNames('im-warning-modal', {
        active: show,
      })}
      onMouseDown={handleCloseModal}
    >
      <div className="im-warning" onMouseDown={(e) => e.stopPropagation()}>
        <div className="im-warning-title">
          <span>{t('warning.title')}</span>
        </div>
        <div className="im-warning-content">
          <span style={{ color: '#ff8888' }}>{t('warning.tips1')}</span>
        </div>
        <div className="im-warning-shortkeys">
          <span style={{ width: '50%' }}>
            <code>W</code> {t('warning.move_w')}
          </span>
          <span style={{ width: '50%' }}>
            <code>A</code> {t('warning.move_a')}
          </span>
          <span style={{ width: '50%' }}>
            <code>S</code> {t('warning.move_s')}
          </span>
          <span style={{ width: '50%' }}>
            <code>D</code> {t('warning.move_d')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+Q</code> {t('warning.ctrl_q')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+G</code> {t('warning.ctrl_g')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+A</code> {t('warning.ctrl_a')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+S</code> {t('warning.ctrl_s')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+D</code> {t('warning.ctrl_d')}
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+F</code> {t('warning.ctrl_f')}
          </span>
        </div>
        <div className="im-warning-contacts">
          <span>{t('contact.group')}</span>
          <span>{t('contact.email')}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
