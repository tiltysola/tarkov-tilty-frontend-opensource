import { useState } from 'react';

import Icon from '@/components/Icon';

import './style.less';

const Index = () => {
  const [setActiveModal] = useState<InteractiveMap.AdditionFunc>();

  return (
    <div className="im-additionfunc">
      <div className="im-additionfunc-list">
        <div className="im-additionfunc-list-item" onClick={() => setActiveModal('tradertimer')}>
          <Icon type="icon-exchange-dollar-fill" />
        </div>
        <div
          className="im-additionfunc-list-item"
          onClick={() => window.open('https://qm.qq.com/q/uc8CN7kZeU')}
        >
          <Icon type="icon-qq-fill" />
        </div>
        <div
          className="im-additionfunc-list-item"
          onClick={() => window.open('https://chat.tilty.cn/')}
        >
          <Icon type="icon-voiceprint-fill" />
        </div>
        <div
          className="im-additionfunc-list-item"
          onClick={() => window.open('https://space.bilibili.com/2961610')}
        >
          <Icon type="icon-bilibili-fill" />
        </div>
        <div
          className="im-additionfunc-list-item"
          onClick={() =>
            window.open('https://realm.mahoutsukai.cn/article/20139c50404344d09db2b098e9c86b90')
          }
        >
          <Icon type="icon-question-fill" />
        </div>
      </div>
    </div>
  );
};

export default Index;
