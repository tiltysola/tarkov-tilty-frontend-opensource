import { useEffect, useMemo, useState } from 'react';

import { useInterval } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';

import './style.less';

interface MapInfoProps {
  mapData: InteractiveMap.Data;
  show: boolean;
}

const Index = (props: MapInfoProps) => {
  const { mapData, show } = props;

  const [realTime, setRealTime] = useState(0);
  const [timeDiff, setTimeDiff] = useState(0);
  const tarkovTime = useMemo(() => {
    return (((realTime + timeDiff) * 7) % (24 * 3600000)) - 5 * 3600000;
  }, [realTime]);

  useEffect(() => {
    const machineTime = dayjs().valueOf();
    setRealTime(machineTime);
    setTimeDiff(0);
  }, []);

  useInterval(() => {
    const machineTime = dayjs().valueOf();
    setRealTime(machineTime);
  }, 100);

  return (
    <div
      className={classNames('im-mapinfo', {
        active: show,
      })}
    >
      <div className="im-mapinfo-title">
        <span>概览</span>
      </div>
      <div className="im-mapinfo-item">
        <span className="im-mapinfo-item-title">战局时间:</span>
        <span className="tarkov-time">{dayjs(tarkovTime).format('HH:mm:ss')}</span>
        <span className="tarkov-time">{dayjs(tarkovTime).add(12, 'hours').format('HH:mm:ss')}</span>
      </div>
      {mapData.players && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">PMC数量:</span>
          <span>{mapData.players}</span>
        </div>
      )}
      {mapData.raidDuration && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">战局时间:</span>
          <span>{mapData.raidDuration} 分钟</span>
        </div>
      )}
    </div>
  );
};

export default Index;
