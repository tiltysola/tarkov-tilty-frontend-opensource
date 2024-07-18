import { Group } from 'react-konva';

import { getIconCDN, mouseClickEvent, mouseHoverEvent } from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface LocksProps {
  locks: InteractiveMap.Lock[];
  show: string[];
}

const Index = (props: LocksProps & InteractiveMap.UtilProps) => {
  const {
    locks = [],
    baseMapStatus,
    mapScale,
    activeLayer,
    heightRange,
    real2imagePos,
    show,
  } = props;
  if (baseMapStatus === 'loaded' && show.length > 0) {
    return (
      <Group>
        {locks.map((lock) => {
          const lockHeight = lock.position.y;
          let active = true;
          if (activeLayer) {
            if (lockHeight < heightRange[0] || lockHeight > heightRange[1]) {
              active = false;
            }
          }
          if (show.includes('lock')) {
            return (
              <Group
                id={`im-lock-group-${lock.lockType}-${lock.position.x}-${lock.position.z}`}
                {...mouseHoverEvent}
                {...mouseClickEvent({
                  text: lock.key.name,
                  mapScale,
                  position: {
                    x: lock.position.x,
                    y: lock.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Image
                  id={`im-lock-image-${lock.lockType}-${lock.position.x}-${lock.position.z}`}
                  x={real2imagePos.x(lock.position.x) - 12 / mapScale}
                  y={real2imagePos.y(lock.position.z) - 20 / mapScale}
                  width={20 / mapScale}
                  height={20 / mapScale}
                  imageSrc={getIconCDN('lock')}
                />
              </Group>
            );
          } else {
            return null;
          }
        })}
      </Group>
    );
  } else {
    return null;
  }
};

export default Index;
