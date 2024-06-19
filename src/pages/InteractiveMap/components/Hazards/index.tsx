import { useState } from 'react';
import { Group, Path } from 'react-konva';

import { getIconCDN, mouseClickEvent, mouseHoverEvent } from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface HazardsProps {
  hazards: InteractiveMap.Hazard[];
  show: string[];
}

const Index = (props: HazardsProps & InteractiveMap.UtilProps) => {
  const {
    hazards = [],
    baseMapStatus,
    mapScale,
    activeLayer,
    heightRange,
    real2imagePos,
    show,
  } = props;

  const [activeId, setActiveId] = useState<string>();

  if (baseMapStatus === 'loaded' && show.length > 0) {
    return (
      <Group>
        {hazards.map((hazard) => {
          const hazardHeight = hazard.position.y;
          let active = true;
          if (activeLayer) {
            if (hazardHeight < heightRange[0] || hazardHeight > heightRange[1]) {
              active = false;
            }
          }
          const startPoint = [0, 0];
          const outline = hazard.outline
            .map((ol) => {
              const imagePos = real2imagePos.p({ x: ol.x, y: ol.z });
              if (imagePos.x - startPoint[0] < startPoint[0]) {
                startPoint[0] = imagePos.x - startPoint[0];
              }
              if (imagePos.y - startPoint[1] < startPoint[1]) {
                startPoint[1] = imagePos.y - startPoint[1];
              }
              return {
                x: imagePos.x,
                y: imagePos.y,
              };
            })
            .map((ol) => {
              return {
                x: ol.x - startPoint[0],
                y: ol.y - startPoint[1],
              };
            });
          if (show.includes('hazard')) {
            const highlighted =
              activeId ===
              `im-hazard-group-${hazard.name}-${hazard.position.x}-${hazard.position.z}`;
            return (
              <Group
                id={`im-hazard-group-${hazard.name}-${hazard.position.x}-${hazard.position.z}`}
                onMouseOver={() => {
                  mouseHoverEvent.onMouseOver();
                  setActiveId(
                    `im-hazard-group-${hazard.name}-${hazard.position.x}-${hazard.position.z}`,
                  );
                }}
                onMouseLeave={() => {
                  mouseHoverEvent.onMouseLeave();
                  setActiveId(undefined);
                }}
                {...mouseClickEvent({
                  text: hazard.name,
                  mapScale,
                  position: {
                    x: hazard.position.x,
                    y: hazard.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Path
                  id={`im-hazard-path-${hazard.name}-${hazard.position.x}-${hazard.position.z}`}
                  x={startPoint[0]}
                  y={startPoint[1]}
                  data={`
                    M ${outline[0].x} ${outline[0].y} L ${outline[1].x} ${outline[1].y}
                    L ${outline[2].x} ${outline[2].y} L ${outline[3].x} ${outline[3].y} Z
                  `}
                  fill={highlighted ? '#ff888888' : '#ff888868'}
                  stroke={highlighted ? '#ff2828' : '#ff282888'}
                  strokeWidth={2 / mapScale}
                  listening={false}
                />
                <Image
                  id={`im-hazard-image-${hazard.name}-${hazard.position.x}-${hazard.position.z}`}
                  x={real2imagePos.x(hazard.position.x) - 12 / mapScale}
                  y={real2imagePos.y(hazard.position.z) - 12 / mapScale}
                  width={24 / mapScale}
                  height={24 / mapScale}
                  imageSrc={getIconCDN('hazard')}
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
