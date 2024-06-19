import { Group } from 'react-konva';

import {
  getIconCDN,
  getLootType,
  mouseClickEvent,
  mouseHoverEvent,
} from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface ExtractsProps {
  lootContainers: InteractiveMap.LootContainer[];
  show: string[];
}

const Index = (props: ExtractsProps & InteractiveMap.UtilProps) => {
  const {
    lootContainers = [],
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
        {lootContainers.map((lootContainer) => {
          const lootContainerHeight = lootContainer.position.y;
          let active = true;
          if (activeLayer) {
            if (lootContainerHeight < heightRange[0] || lootContainerHeight > heightRange[1]) {
              active = false;
            }
          }
          const lootType = getLootType(lootContainer.lootContainer.normalizedName);
          if (show.includes(lootType)) {
            return (
              <Group
                id={`im-container-group-${lootType}-${lootContainer.position.x}-${lootContainer.position.z}`}
                {...mouseHoverEvent}
                {...mouseClickEvent({
                  text: lootContainer.lootContainer.name,
                  mapScale,
                  position: {
                    x: lootContainer.position.x,
                    y: lootContainer.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Image
                  id={`im-container-image-${lootType}-${lootContainer.position.x}-${lootContainer.position.z}`}
                  x={real2imagePos.x(lootContainer.position.x) - 12 / mapScale}
                  y={real2imagePos.y(lootContainer.position.z) - 12 / mapScale}
                  width={24 / mapScale}
                  height={24 / mapScale}
                  imageSrc={getIconCDN(`container_${lootContainer.lootContainer.normalizedName}`)}
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
