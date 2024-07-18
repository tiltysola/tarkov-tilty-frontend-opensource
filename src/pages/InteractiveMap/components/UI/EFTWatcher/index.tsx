import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

interface EFTWatcherProps {
  directoryHandler?: FileSystemDirectoryHandle;
  tarkovGamePathHandler?: FileSystemDirectoryHandle;
  onClickEftWatcherPath: () => void;
  onClickTarkovGamePath: () => void;
}

const Index = (props: EFTWatcherProps) => {
  const { directoryHandler, tarkovGamePathHandler, onClickEftWatcherPath, onClickTarkovGamePath } =
    props;

  const [show, setShow] = useState(false);

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleCloseModal = () => {
    if (!window.showDirectoryPicker) {
      setShow(false);
    }
  };

  const handleClickEftWatcherPath = () => {
    onClickEftWatcherPath();
  };

  const handleClickTarkovGamePath = () => {
    onClickTarkovGamePath();
  };

  useEffect(() => {
    if (directoryHandler && tarkovGamePathHandler) {
      setShow(false);
    }
  }, [directoryHandler, tarkovGamePathHandler]);

  useEffect(() => {
    if (self === top) {
      setShow(true);
    }
  }, []);

  return (
    <div
      className={classNames('im-eftwatcher-modal', {
        active: show,
      })}
      onMouseDown={handleCloseModal}
    >
      <div className="im-eftwatcher" onMouseDown={(e) => e.stopPropagation()}>
        <div className="im-eftwatcher-title">
          <span>{t('eftwatcher.title')}</span>
        </div>
        <div className="im-eftwatcher-content">
          <span>{t('eftwatcher.tips1')}</span>
          <span>{t('eftwatcher.tips2')}</span>
          <span>{t('eftwatcher.tips3')}</span>
          <span style={{ color: '#ffff88' }}>{t('eftwatcher.tips4')}</span>
          <span style={{ color: '#ffff88' }}>{t('eftwatcher.tips5')}</span>
        </div>
        <div className="im-eftwatcher-buttons">
          {window.showDirectoryPicker ? (
            <button
              style={{ color: !directoryHandler ? '#ffffff' : '#288828' }}
              className="button button-default"
              onClick={() => handleClickEftWatcherPath()}
            >
              {directoryHandler ? t('eftwatcher.disableScrPath') : t('eftwatcher.enableScrPath')}
            </button>
          ) : (
            <button className="button button-default">{t('eftwatcher.unsupport')}</button>
          )}
          {window.showDirectoryPicker && (
            <button
              style={{ marginTop: 16, color: !tarkovGamePathHandler ? '#ffffff' : '#288828' }}
              className="button button-default"
              onClick={() => handleClickTarkovGamePath()}
            >
              {tarkovGamePathHandler
                ? t('eftwatcher.disableGamePath')
                : t('eftwatcher.enableGamePath')}
            </button>
          )}
          <button
            style={{ marginTop: 16 }}
            className="button button-default"
            onClick={() => setShow(false)}
          >
            {t('eftwatcher.later')}
          </button>
        </div>
        <div className="im-eftwatcher-contacts">
          <span>{t('contact.group')}</span>
          <span>{t('contact.email')}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
