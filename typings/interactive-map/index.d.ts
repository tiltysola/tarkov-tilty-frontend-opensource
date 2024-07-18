declare namespace InteractiveMap {
  interface Data {
    id: string;
    tarkovDataId: string;
    name: string;
    normalizedName: string;
    wiki: string;
    description: string;
    enemies: string[];
    raidDuration: number;
    players: string;
    bosses: Boss[];
    spawns: Spawn[];
    extracts: Extract[];
    locks: Lock[];
    hazards: Hazard[];
    lootContainers: LootContainer[];
    stationaryWeapons: StationaryWeapon[];

    key: string;
    tileSize: number;
    minZoom: number;
    maxZoom: number;
    transform: number[];
    coordinateRotation: number;
    bounds: number[][];
    heightRange: number[];
    author: string;
    authorLink: string;
    svgPath: string;
    tilePath: string;
    layers?: Layer[];
    labels: Label[];
  }

  interface Boss {
    boss: {
      id: string;
      name: string;
      normalizedName: string;
      imagePortraitLink: string;
      imagePosterLink: string;
    };
    spawnChance: number;
    spawnLocations: {
      spawnKey: string;
      name: string;
      chance: number;
    }[];
  }

  interface Spawn {
    zoneName: string;
    position: Position;
    sides: string[];
    categories: string[];
  }
  
  interface Extract {
    id: string;
    name: string;
    faction: Faction;
    switches: Switch[];
    position: Position;
    outline: Position[];
    top: number;
    bottom: number;
  }

  interface Lock {
    lockType: string;
    key: {
      id: string;
      name: string;
      normalizedName: string;
    };
    needsPower: boolean;
    position: Position;
    outline: Position[];
    top: number;
    bottom: number;
  }

  interface Hazard {
    hazardType: string;
    name: string;
    position: Position;
    outline: Position[];
    top: number;
    bottom: number;
  }

  interface LootContainer {
    lootContainer: {
      id: string;
      name: string;
      normalizedName: string;
    };
    position: Position;
  }

  interface StationaryWeapon {
    stationaryWeapon: {
      id: string;
      name: string;
      shortName: string;
    };
    position: Position;
  }

  interface PossibleLocation {
    map: {
      id: string;
    }
    positions: Position[];
  }

  interface Position {
    x: number;
    y: number;
    z: number;
  }
  
  interface Switch {
    id: string;
    name: string;
    switchType: string;
    position: Position;
  }

  interface Layer {
    extents: Extent[];
    name: string;
    show: boolean;
    svgPath: string;
    tilePath: string;
  }

  interface Label {
    bottom: number;
    position: number[];
    rotation?: number;
    size: number;
    text: string;
    top: number;
  }

  interface Extent {
    height: number[];
  }

  interface Position2D {
    x: number;
    y: number;
  }

  interface ImageProps {
    width: number;
    height: number;
  }
  
  interface ImageTransformProps {
    x: (pos: number) => number;
    y: (pos: number) => number;
    p: (pos: Position2D) => Position2D;
  }

  interface UtilProps {
    baseMapStatus: MapStatus;
    baseScale: number;
    mapScale: number;
    activeLayer: Layer | undefined;
    heightRange: number[];
    image2realPos: ImageTransformProps;
    real2imagePos: ImageTransformProps;
  }

  interface DrawProps {
    strokeType: StrokeType;
    strokeColor: string;
    strokeWidth: number;
    eraserWidth: number;
  }

  interface iMDrawLine extends DrawProps {
    uuid: string;
    mapId: string;
    tool: string;
    points: number[];
    name?: string;
    member: boolean;
    updatedAt: number;
  }

  interface RaidLogProps {
    profileId: string;
    status: string;
    raidMode: string;
    ip: string;
    port: string;
    location: string;
    sid: string;
    gameMode: string;
    shortId: string;
    realTime: string | null;
  }

  interface ProfileLogProps {
    profileId: string;
    accountId: string;
  }

  interface UserConfirmedLogProps {
    type: string;
    eventId: string;
    profileid: string;
    profileToken: string;
    status: string;
    ip: string;
    port: number;
    sid: string;
    version: string;
    location: string;
    raidMode: string;
    mode: string;
    shortId: string;
    additional_info: any[];
  }

  type Faction = 'pmc' | 'scav' | 'shared';

  type MapStatus = 'loaded' | 'loading' | 'failed';

  type StrokeType = 'drag' | 'draw' | 'eraser' | 3 | 'ruler';
  type OperationType = -1 | 0 | 1 | 2;

  type QuickTools = 'marker' | 'draw' | 'eraser' | 'setting';
  type AdditionFunc = 'tradertimer';
}
