import { ChangeEvent, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import './style.less';

interface QuickSearchProps {
  show: boolean;
  onHide?: () => void;
}

const Index = (props: QuickSearchProps) => {
  const { show, onHide } = props;

  const [value, setValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    onHide?.();
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    if (value) {
      const regexp =
        /([0-9.-]+), ([0-9.-]+), ([0-9.-]+)_([0-9.-]+), ([0-9.-]+), ([0-9.-]+), ([0-9.-]+)/i;
      const location = value.match(regexp);
      if (location) {
        (window as any).interactUpdateLocation?.(value);
        setValue('');
        onHide?.();
      }
    }
  }, [value]);

  return (
    <div
      className={classNames('im-quicksearch-modal', {
        active: show,
      })}
      onMouseDown={handleCloseModal}
    >
      <div className="im-quicksearch" onMouseDown={(e) => e.stopPropagation()}>
        <div className="im-quicksearch-input">
          <input
            ref={inputRef}
            value={value}
            onChange={handleValueChange}
            placeholder="粘贴截图名称..."
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
