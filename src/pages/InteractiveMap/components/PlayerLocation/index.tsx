import { useEffect, useState } from 'react';
import { Group, Path, Text } from 'react-konva';

import dayjs from 'dayjs';

import { quaternionToEulerAngles } from '@/utils/tarkov';

import { getIconPath, mouseClickEvent, mouseHoverEvent } from '@/pages/InteractiveMap/utils';

import './style.less';

interface PlayerLocationProps {
  activeMapId?: string;
  show: string[];
  onPlayerLocationChange?: (pl: InteractiveMap.Position & { mapId: string }) => void;
}

interface iMPlayerLocation {
  uuid: string;
  mapId: string;
  x: number;
  y: number;
  z: number;
  quaternion?: number[];
  name?: string;
  member: boolean;
  updatedAt: number;
}

const Index = (props: PlayerLocationProps & InteractiveMap.UtilProps) => {
  const {
    activeMapId,
    baseMapStatus,
    mapScale,
    activeLayer,
    heightRange,
    real2imagePos,
    show,
    onPlayerLocationChange,
  } = props;

  const [playerLocations, setPlayerLocations] = useState<{
    [key: string]: iMPlayerLocation;
  }>();

  useEffect(() => {
    (window as any).interactUpdateLocation = (filename: string) => {
      const regexp =
        /([0-9.-]+), ([0-9.-]+), ([0-9.-]+)_([0-9.-]+), ([0-9.-]+), ([0-9.-]+), ([0-9.-]+)/i;
      const location = filename.match(regexp);
      if (activeMapId && location) {
        const data = {
          x: Number(location[1]),
          y: Number(location[2]),
          z: Number(location[3]),
          quaternion: [location[4], location[5], location[6], location[7]].map((v) => Number(v)),
          mapId: activeMapId,
        };
        // onPlayerLocationChange?.(data);
        setPlayerLocations({
          self: {
            uuid: '0',
            member: true,
            ...data,
            updatedAt: dayjs().valueOf(),
          },
        });
      }
    };
  }, [activeMapId, onPlayerLocationChange]);

  if (baseMapStatus === 'loaded' && playerLocations && show.length > 0) {
    return (
      <Group>
        {Object.keys(playerLocations)
          .filter((key) => {
            const location = playerLocations[key];
            return location.mapId === activeMapId;
          })
          .map((key) => {
            const location = playerLocations[key];
            let active = true;
            if (activeLayer) {
              if (location.y < heightRange[0] || location.y > heightRange[1]) {
                active = false;
              }
            }
            if (show.includes('playerLocation')) {
              return (
                <Group
                  id={`im-playerlocation-group-${location.uuid}`}
                  {...mouseHoverEvent}
                  {...mouseClickEvent({
                    text: (
                      <div className="im-playerlocation-tooltip">
                        <div className="im-playerlocation-tooltip-user">
                          <span>{location.name || '本地'}</span>
                        </div>
                        <div className="im-playerlocation-tooltip-location">
                          <span>
                            [{location.x}, {location.y}, {location.z}]
                          </span>
                        </div>
                        <div className="im-playerlocation-tooltip-update">
                          <span>Updated At: {dayjs(location.updatedAt).format('MM/DD HH:mm')}</span>
                        </div>
                      </div>
                    ),
                    mapScale,
                    position: {
                      x: location.x,
                      y: location.z,
                    },
                    offset: {
                      y: -8,
                    },
                    real2imagePos,
                  })}
                  opacity={active ? 1 : 0.1}
                  listening={active}
                >
                  {location.quaternion && (
                    <Path
                      x={real2imagePos.x(location.x)}
                      y={real2imagePos.y(location.z) - 16 / mapScale}
                      data={'M 0 0 L 30 80 L -30 80 L 0 0 Z'}
                      fill={'#00000068'}
                      rotation={quaternionToEulerAngles(location.quaternion)[0]}
                      scale={{ x: 1 / mapScale, y: 1 / mapScale }}
                    />
                  )}
                  <Group
                    id={`im-playerlocation-path-${location.uuid}`}
                    x={real2imagePos.x(location.x) - 15 / mapScale}
                    y={real2imagePos.y(location.z) - 30 / mapScale}
                    scale={{ x: 0.03 / mapScale, y: 0.03 / mapScale }}
                  >
                    {getIconPath('location-fill').map((p) => {
                      return <Path fill="#00ff00" data={p} shadowColor="#000000" shadowBlur={50} />;
                    })}
                  </Group>
                  <Text
                    id={`im-playerlocation-text-${location.uuid}`}
                    x={real2imagePos.x(location.x)}
                    y={real2imagePos.y(location.z)}
                    fontFamily="JinBuTi"
                    text="你的位置"
                    fontSize={12 / mapScale}
                    fill="#00ff00"
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
