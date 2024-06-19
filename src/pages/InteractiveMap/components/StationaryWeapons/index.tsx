import { Group } from 'react-konva';

import { getIconCDN, mouseClickEvent, mouseHoverEvent } from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface StationaryWeaponsProps {
  stationaryWeapons: InteractiveMap.StationaryWeapon[];
  show: string[];
}

const Index = (props: StationaryWeaponsProps & InteractiveMap.UtilProps) => {
  const {
    stationaryWeapons = [],
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
        {stationaryWeapons.map((stationaryWeapon) => {
          const stationaryWeaponHeight = stationaryWeapon.position.y;
          let active = true;
          if (activeLayer) {
            if (
              stationaryWeaponHeight < heightRange[0] ||
              stationaryWeaponHeight > heightRange[1]
            ) {
              active = false;
            }
          }
          if (show.includes('stationaryWeapon')) {
            return (
              <Group
                id={`im-stationaryWeapon-group-${stationaryWeapon.stationaryWeapon.id}-${stationaryWeapon.position.x}-${stationaryWeapon.position.z}`}
                {...mouseHoverEvent}
                {...mouseClickEvent({
                  text: stationaryWeapon.stationaryWeapon.name,
                  mapScale,
                  position: {
                    x: stationaryWeapon.position.x,
                    y: stationaryWeapon.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Image
                  id={`im-stationaryWeapon-image-${stationaryWeapon.stationaryWeapon.id}-${stationaryWeapon.position.x}-${stationaryWeapon.position.z}`}
                  x={real2imagePos.x(stationaryWeapon.position.x) - 12 / mapScale}
                  y={real2imagePos.y(stationaryWeapon.position.z) - 20 / mapScale}
                  width={24 / mapScale}
                  height={24 / mapScale}
                  imageSrc={getIconCDN('stationarygun')}
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
