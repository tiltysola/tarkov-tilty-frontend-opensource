import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

export interface SettingProps {
  directoryHandler?: FileSystemDirectoryHandle;
  tarkovGamePathHandler?: FileSystemDirectoryHandle;
  locationScale: boolean;
  onClickEftWatcherPath: () => void;
  onClickTarkovGamePathPath: () => void;
  onLocationScaleChange: (b: boolean) => void;
}

const Index = (props: SettingProps) => {
  const {
    locationScale,
    directoryHandler,
    tarkovGamePathHandler,
    onLocationScaleChange,
    onClickEftWatcherPath,
    onClickTarkovGamePathPath,
  } = props;

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleClickEftWatcherPath = () => {
    onClickEftWatcherPath();
  };

  const handleClickTarkovGamePathPath = () => {
    onClickTarkovGamePathPath();
  };

  const handleToggleLocationScale = () => {
    onLocationScaleChange(!locationScale);
  };

  return (
    <div className="im-quicktools-modal-setting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-setting-title">
        <span>{t('setting.title')}</span>
      </div>
      <div className="im-quicktools-modal-setting-block">
        {self === top && (
          <button
            className="im-quicktools-modal-setting-button"
            style={{ color: !directoryHandler ? '#ffffff' : '#288828' }}
            onClick={handleClickEftWatcherPath}
          >
            {directoryHandler
              ? `${t('setting.realtimeMarker')} ${directoryHandler?.name}`
              : t('setting.enableMarker')}
          </button>
        )}
        {self === top && (
          <button
            className="im-quicktools-modal-setting-button"
            style={{ color: !tarkovGamePathHandler ? '#ffffff' : '#288828' }}
            onClick={handleClickTarkovGamePathPath}
          >
            {tarkovGamePathHandler
              ? `${t('setting.tarkovGamePath')} ${tarkovGamePathHandler?.name}`
              : t('setting.enableTarkovGamePath')}
          </button>
        )}
        <button
          style={{ color: !locationScale ? '#882828' : '#288828' }}
          className="im-quicktools-modal-setting-button"
          onClick={handleToggleLocationScale}
        >
          {t('setting.markerScale')} ({locationScale ? t('common.enable') : t('common.disable')})
        </button>
      </div>
    </div>
  );
};

export default Index;
