import Slider from 'rc-slider';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

export interface EraserSettingProps {
  eraserWidth: number;
  onEraserWidthChange: (w: number) => void;
}

const Index = (props: EraserSettingProps) => {
  const { eraserWidth, onEraserWidthChange } = props;

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  return (
    <div className="im-quicktools-modal-erasersetting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-erasersetting-title">
        <span>{t('others.eraserWidth')}</span>
      </div>
      <div className="im-quicktools-modal-erasersetting-block">
        <Slider
          style={{ width: 'calc(100% - 12px)', margin: '0 6px' }}
          min={0.1}
          max={20}
          step={0.1}
          value={eraserWidth}
          onChange={(w) => onEraserWidthChange?.(w as number)}
        />
      </div>
    </div>
  );
};

export default Index;
