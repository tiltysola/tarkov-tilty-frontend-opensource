import { useState } from 'react';

import classNames from 'classnames';

import './style.less';

const Index = () => {
  const [show, setShow] = useState(true);

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
          <span>互动地图 - 缇尔蒂 / 告知</span>
        </div>
        <div className="im-warning-shortkeys">
          <span style={{ width: '50%' }}>
            <code>W</code> 向上移动
          </span>
          <span style={{ width: '50%' }}>
            <code>A</code> 向左移动
          </span>
          <span style={{ width: '50%' }}>
            <code>S</code> 向下移动
          </span>
          <span style={{ width: '50%' }}>
            <code>D</code> 向右移动
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+Q</code> 手动定位/搜索
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+G</code> 简易UI模式
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+A</code> 拖拽模式
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+S</code> 笔刷模式
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+D</code> 橡皮模式
          </span>
          <span style={{ width: '50%' }}>
            <code>Ctrl+F</code> 测距模式
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
