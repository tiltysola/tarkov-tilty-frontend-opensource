import { Group } from 'react-konva';

import {
  getIconCDN,
  getSpawnType,
  mouseClickEvent,
  mouseHoverEvent,
} from '@/pages/InteractiveMap/utils';

import Image from '../Image';

interface SpawnsProps {
  baseMap: InteractiveMap.Data;
  spawns: InteractiveMap.Spawn[];
  show: string[];
}

interface SpawnBoss {
  spawnKey: string;
  spawnChance: number;
  name: string;
  normalizedName: string;
  subSpawnChance: number;
}

const Index = (props: SpawnsProps & InteractiveMap.UtilProps) => {
  const {
    baseMap,
    spawns = [],
    baseMapStatus,
    mapScale,
    activeLayer,
    heightRange,
    real2imagePos,
    show,
  } = props;
  const bosses: { [key: string]: SpawnBoss } = {};
  baseMap.bosses?.forEach((boss) => {
    boss.spawnLocations.forEach((spawnLocation) => {
      bosses[spawnLocation.spawnKey] = {
        spawnKey: spawnLocation.spawnKey,
        spawnChance: boss.spawnChance,
        name: boss.boss.name,
        normalizedName: boss.boss.normalizedName,
        subSpawnChance: spawnLocation.chance,
      };
    });
  });
  if (baseMapStatus === 'loaded' && show.length > 0) {
    return (
      <Group>
        {spawns.map((spawn) => {
          const spawnHeight = spawn.position.y;
          let active = true;
          if (activeLayer) {
            if (spawnHeight < heightRange[0] || spawnHeight > heightRange[1]) {
              active = false;
            }
          }
          if (show.includes(getSpawnType(spawn.categories))) {
            return (
              <Group
                id={`im-spawn-group-${spawn.zoneName}-${spawn.position.x}-${spawn.position.z}`}
                {...mouseHoverEvent}
                {...mouseClickEvent({
                  text: bosses[spawn.zoneName] ? (
                    <span>
                      {bosses[spawn.zoneName]?.name} ({bosses[spawn.zoneName].spawnChance * 100}%)
                    </span>
                  ) : (
                    `${spawn.zoneName}`
                  ),
                  mapScale,
                  position: {
                    x: spawn.position.x,
                    y: spawn.position.z,
                  },
                  real2imagePos,
                })}
                opacity={active ? 1 : 0.1}
                listening={active}
              >
                <Image
                  id={`im-spawn-image-${spawn.zoneName}-${spawn.position.x}-${spawn.position.z}`}
                  x={real2imagePos.x(spawn.position.x) - 12 / mapScale}
                  y={real2imagePos.y(spawn.position.z) - 20 / mapScale}
                  width={24 / mapScale}
                  height={24 / mapScale}
                  imageSrc={getIconCDN(
                    `spawn_${getSpawnType(spawn.categories, bosses[spawn.zoneName]?.normalizedName)}`,
                  )}
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
