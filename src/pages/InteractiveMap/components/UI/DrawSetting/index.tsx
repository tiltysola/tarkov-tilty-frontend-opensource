import { CirclePicker } from 'react-color';

import Slider from 'rc-slider';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import { drawColorList } from '@/pages/InteractiveMap/utils';

import './style.less';

export interface DrawSettingProps {
  strokeColor: string;
  strokeWidth: number;
  onStrokeColorChange: (c: string) => void;
  onStrokeWidthChange: (w: number) => void;
}

const Index = (props: DrawSettingProps) => {
  const { strokeColor, strokeWidth, onStrokeColorChange, onStrokeWidthChange } = props;

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  return (
    <div className="im-quicktools-modal-drawsetting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-drawsetting-title">
        <span>{t('others.colorSetting')}</span>
      </div>
      <div className="im-quicktools-modal-drawsetting-block">
        <CirclePicker
          colors={drawColorList.map((v) => v.color)}
          color={strokeColor}
          onChangeComplete={(c) => onStrokeColorChange?.(c.hex)}
        />
      </div>
      <div className="im-quicktools-modal-drawsetting-title">
        <span>{t('others.strokeWidth')}</span>
      </div>
      <div className="im-quicktools-modal-drawsetting-block">
        <Slider
          style={{ width: 'calc(100% - 12px)', margin: '0 6px' }}
          min={0.1}
          max={5}
          step={0.1}
          value={strokeWidth}
          onChange={(w) => onStrokeWidthChange?.(w as number)}
        />
      </div>
    </div>
  );
};

export default Index;
