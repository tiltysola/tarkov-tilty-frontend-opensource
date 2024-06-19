import { useRef, useState } from 'react';

import classNames from 'classnames';
import numbro from 'numbro';

import './style.less';

const Index = (props: { item: any; children: JSX.Element | JSX.Element[] }) => {
  const { item, children } = props;

  const [position, setPosition] = useState([0, 0]);
  const [visible, setVisible] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  if (item) {
    return (
      <div className="item-popover" ref={popoverRef}>
        <div
          className={classNames('item-popover-modal', {
            visible,
          })}
          style={{
            left: position[0] > 8 ? position[0] : 8,
            bottom: position[1],
          }}
        >
          <div>
            <div className="item-popover-modal-title" style={{ marginBottom: 8 }}>
              <span>{item.name}</span>
            </div>
            {item.suitableBuyer && (
              <div>
                <span className="text text-normal font-size-12">
                  商人购买：
                  {numbro(item.suitableBuyer?.price).format({
                    thousandSeparated: true,
                  })}{' '}
                  {item.suitableBuyer?.currency}
                </span>
              </div>
            )}
            {item.suitableSeller && (
              <div>
                <span className="text text-normal font-size-12">
                  商人出售：
                  {numbro(item.suitableSeller?.price).format({
                    thousandSeparated: true,
                  })}{' '}
                  {item.suitableSeller?.currency}
                </span>
              </div>
            )}
            {item.avg24hPrice ? (
              <div>
                <span className="text text-normal font-size-12">
                  跳蚤市场：
                  {numbro(item.avg24hPrice || 0).format({
                    thousandSeparated: true,
                  })}{' '}
                  RUB
                </span>
              </div>
            ) : null}
            {item.fleaMarketFee ? (
              <div>
                <span className="text text-normal font-size-12">
                  手续费：
                  {numbro(item.fleaMarketFee || 0).format({
                    thousandSeparated: true,
                  })}{' '}
                  RUB
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <img src={item.iconLink} />
          </div>
        </div>
        <div
          className="item-popover-trigger"
          onMouseEnter={() => {
            const x = (popoverRef.current?.clientWidth || 0) / 2 - 120;
            const y = (popoverRef.current?.clientHeight || 0) + 16;
            setPosition([x, y]);
            setVisible(true);
          }}
          onMouseLeave={() => {
            setVisible(false);
          }}
        >
          {children}
        </div>
      </div>
    );
  } else {
    return children;
  }
};

export default Index;
