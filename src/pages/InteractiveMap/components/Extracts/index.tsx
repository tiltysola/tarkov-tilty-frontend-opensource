import { Group, Text } from 'react-konva';

import { getIconCDN, mouseClickEvent, mouseHoverEvent } from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface ExtractsProps {
  extracts: InteractiveMap.Extract[];
  show: InteractiveMap.Faction[];
}

const Index = (props: ExtractsProps & InteractiveMap.UtilProps) => {
  const {
    extracts = [],
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
        {extracts.map((extract) => {
          const colorMap: any = {
            pmc: '#88ff00',
            scav: '#ff8800',
            shared: '#00ccff',
          };
          const extractHeight = extract.position.y;
          let active = true;
          if (activeLayer) {
            if (extractHeight < heightRange[0] || extractHeight > heightRange[1]) {
              active = false;
            }
          }
          if (show.includes(extract.faction)) {
            return (
              <Group
                id={`im-extract-group-${extract.id}-${extract.position.x}-${extract.position.z}`}
                {...mouseHoverEvent}
                {...mouseClickEvent({
                  text: extract.name,
                  mapScale,
                  position: {
                    x: extract.position.x,
                    y: extract.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Image
                  id={`im-extract-image-${extract.id}-${extract.position.x}-${extract.position.z}`}
                  x={real2imagePos.x(extract.position.x) - 12 / mapScale}
                  y={real2imagePos.y(extract.position.z) - 20 / mapScale}
                  width={24 / mapScale}
                  height={24 / mapScale}
                  imageSrc={getIconCDN(`extract_${extract.faction}`)}
                />
                <Text
                  id={`im-extract-text-${extract.id}-${extract.position.x}-${extract.position.z}`}
                  x={real2imagePos.x(extract.position.x)}
                  y={real2imagePos.y(extract.position.z)}
                  fontFamily="JinBuTi"
                  text={extract.name}
                  fontSize={12 / mapScale}
                  fill={colorMap[extract.faction]}
                  width={600 / mapScale}
                  offsetX={300 / mapScale}
                  align="center"
                  shadowColor="#000000"
                  shadowBlur={12 / mapScale}
                  offsetY={-6 / mapScale}
                  listening={false}
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
