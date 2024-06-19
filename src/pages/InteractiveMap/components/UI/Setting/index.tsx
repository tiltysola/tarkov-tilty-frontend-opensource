import './style.less';

export interface SettingProps {
  locationScale: boolean;
  onLocationScaleChange: (b: boolean) => void;
}

const Index = (props: SettingProps) => {
  const { locationScale, onLocationScaleChange } = props;

  const handleToggleLocationScale = () => {
    onLocationScaleChange(!locationScale);
  };

  return (
    <div className="im-quicktools-modal-setting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-setting-title">
        <span>高级设置</span>
      </div>
      <div className="im-quicktools-modal-setting-block">
        <button
          className="im-quicktools-modal-setting-button"
          style={{ color: !locationScale ? '#882828' : '#288828' }}
          onClick={handleToggleLocationScale}
        >
          标点缩放 ({locationScale ? '启用' : '禁用'})
        </button>
      </div>
    </div>
  );
};

export default Index;
