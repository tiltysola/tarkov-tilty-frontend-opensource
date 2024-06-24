import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './style.less';

const Index = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/');
  };

  useEffect(() => {
    const resizeEvent = () => {
      const doc = document.documentElement;
      doc?.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    resizeEvent();
    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, []);

  return (
    <div className="notfound">
      <div className="notfound-flex">
        <div className="notfound-logo">
          <img alt="logo" src="/images/tilty_logo_round_white.png" />
        </div>
        <div className="notfound-header">
          <span>お探しのページは見つかりませんでした</span>
        </div>
        <div className="notfound-describe">
          <span>
            杂鱼、杂鱼，你是转身就忘了自己游过的水流吗？这么快就迷失在这个数字海洋里啦？哈哈，别告诉我你连回家的路都不记得了。
          </span>
        </div>
        <div className="notfound-button">
          <button className="button button-default" onClick={handleReturn}>
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
