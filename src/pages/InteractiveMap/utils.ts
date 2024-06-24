import { KonvaEventObject } from 'konva/lib/Node';

import { showTooltip } from './components/UI/Tooltip';

interface MouseClickEvent {
  text: JSX.Element | string;
  mapScale: number;
  position: InteractiveMap.Position2D;
  offset?: { x?: number; y?: number };
  real2imagePos: InteractiveMap.ImageTransformProps;
}

export const drawColorList = [{
  color: '#9a8866',
}, {
  color: '#000000',
}, {
  color: '#ffffff',
}, {
  color: '#8888ff',
}, {
  color: '#88ff88',
}, {
  color: '#ff8888',
}, {
  color: '#888800',
}, {
  color: '#880088',
}, {
  color: '#008888',
}, {
  color: '#000088',
}, {
  color: '#008800',
}, {
  color: '#880000',
}, {
  color: '#0088ff',
}, {
  color: '#00ff88',
}, {
  color: '#8800ff',
}, {
  color: '#88ff00',
}, {
  color: '#ff0088',
}, {
  color: '#ff8800',
}];

export const icons: any = {
  'container_bank-cash-register': 'container_cash-register',
  'container_bank-safe': 'container_safe',
  'container_buried-barrel-cache': 'container_buried-barrel-cache',
  'container_cash-register': 'container_cash-register',
  'container_cash-register-tar2-2': 'container_cash-register',
  'container_dead-civilian': 'container_dead-scav',
  'container_dead-scav': 'container_dead-scav',
  'container_pmc-body': 'container_dead-scav',
  container_drawer: 'container_drawer',
  'container_duffle-bag': 'container_duffle-bag',
  'container_grenade-box': 'container_grenade-box',
  'container_ground-cache': 'container_ground-cache',
  container_jacket: 'container_jacket',
  'container_lab-technician-body': 'container_dead-scav',
  'container_medbag-smu06': 'container_medbag-smu06',
  container_medcase: 'container_medcase',
  'container_medical-supply-crate': 'container_crate',
  'container_pc-block': 'container_pc-block',
  'container_plastic-suitcase': 'container_plastic-suitcase',
  'container_ration-supply-crate': 'container_crate',
  container_safe: 'container_safe',
  'container_scav-body': 'container_dead-scav',
  'container_shturmans-stash': 'container_weapon-box',
  'container_technical-supply-crate': 'container_crate',
  container_toolbox: 'container_toolbox',
  'container_weapon-box': 'container_weapon-box',
  'container_wooden-ammo-box': 'container_wooden-ammo-box',
  'container_wooden-crate': 'container_wooden-crate',
  extract_pmc: 'extract_pmc',
  extract_scav: 'extract_scav',
  extract_shared: 'extract_shared',
  hazard: 'hazard',
  key: 'key',
  lock: 'lock',
  quest_item: 'quest_item',
  quest_objective: 'quest_objective',
  spawn_sniper_scav: 'spawn_sniper_scav',
  spawn_bloodhound: 'spawn_bloodhound',
  spawn_boss: 'spawn_boss',
  'spawn_cultist-priest': 'spawn_cultist-priest',
  spawn_pmc: 'spawn_pmc',
  spawn_rogue: 'spawn_rogue',
  spawn_scav: 'spawn_scav',
  stationarygun: 'stationarygun',
  switch: 'switch',
};

export const loots: any = {
  'cash-register': {
    key: 'cash-register',
    name: '收银机',
    value: ['bank-cash-register', 'cash-register', 'cash-register-tar2-2'],
    type: 'Common',
  },
  'dead-scav': {
    key: 'dead-scav',
    name: 'Scav尸体',
    value: ['dead-civilian', 'dead-scav', 'pmc-body', 'lab-technician-body', 'scav-body'],
    type: 'Good',
  },
  safe: {
    key: 'safe',
    name: '保险箱',
    value: ['bank-safe', 'safe'],
    type: 'Valuable',
  },
  drawer: {
    key: 'drawer',
    name: '抽屉',
    value: ['drawer'],
    type: 'Good',
  },
  'duffle-bag': {
    key: 'duffle-bag',
    name: '旅行包',
    value: ['duffle-bag'],
    type: 'Good',
  },
  'grenade-box': {
    key: 'grenade-box',
    name: '手雷箱',
    value: ['grenade-box'],
    type: 'Common',
  },
  cache: {
    key: 'cache',
    name: '彩蛋点',
    value: ['buried-barrel-cache', 'ground-cache'],
    type: 'Good',
  },
  jacket: {
    key: 'jacket',
    name: '夹克衫',
    value: ['jacket'],
    type: 'Valuable',
  },
  medcase: {
    key: 'medcase',
    name: '医疗物资',
    value: ['medbag-smu06', 'medcase'],
    type: 'Good',
  },
  crate: {
    key: 'crate',
    name: '物资箱',
    value: ['medical-supply-crate', 'ration-supply-crate', 'technical-supply-crate'],
    type: 'Good',
  },
  'pc-block': {
    key: 'pc-block',
    name: '机箱',
    value: ['pc-block'],
    type: 'Valuable',
  },
  'plastic-suitcase': {
    key: 'plastic-suitcase',
    name: '塑料手提箱',
    value: ['plastic-suitcase'],
    type: 'Good',
  },
  'weapon-box': {
    key: 'weapon-box',
    name: '武器箱',
    value: ['shturmans-stash', 'weapon-box', 'wooden-ammo-box', 'wooden-crate'],
    type: 'Common',
  },
  toolbox: {
    key: 'toolbox',
    name: '工具箱',
    value: ['toolbox'],
    type: 'Good',
  },
};

export const getIconCDN = (iconName: string) => {
  return `/mapIcons/${icons[iconName]}.png`;
};

export const getIconPath = (name: string) => {
  const path: string[] = [];
  const svgEle = document.querySelector(`#icon-${name}`);
  if (svgEle) {
    const pathEles = svgEle.querySelectorAll('path');
    pathEles.forEach((ele) => {
      const attr = ele.getAttribute('d');
      attr && path.push(attr);
    });
  }
  return path;
};

export const getLoot = (type: string, filter?: InteractiveMap.LootContainer[]) => {
  if (filter) {
    const mapContainers = Array.from(
      new Set(filter.map((f) => f.lootContainer.normalizedName)),
    ) || [];
    return Object.keys(loots)
      .map((key) => loots[key])
      .filter((loot) => loot.type === type)
      .filter((loot) => {
        let result = false;
        loot.value.forEach((key: string) => {
          if (mapContainers.includes(key)) result = true;
        });
        return result;
      });
  } else {
    return Object.keys(loots)
      .map((key) => ({ key, ...loots[key] }))
      .filter((loot) => loot.type === type);
  }
};

export const getLootType = (value: string) => {
  let type = 'unknown';
  Object.keys(loots).forEach((key) => {
    const loot = loots[key];
    if (loot.value.includes(value)) type = loot.key;
  });
  return type;
};

export const getSpawnType = (types: string[] = [], normalizedName?: string) => {
  if (normalizedName === 'rogue') {
    return 'rogue';
  } else if (normalizedName === 'cultist-priest') {
    return 'cultist-priest';
  } else if (types.includes('boss')) {
    return 'boss';
  } else if (types.includes('sniper')) {
    return 'sniper_scav';
  } else if (types.includes('bot')) {
    return 'scav';
  } else if (types.includes('player')) {
    return 'pmc';
  } else {
    return 'scav';
  }
};

export const transformMapId = (mapId: string) => {
  let _mapId = mapId;
  if (_mapId === '59fc81d786f774390775787e') _mapId = '55f2d3fd4bdc2d5f408b4567'; // Factory
  if (_mapId === '653e6760052c01c1c805532f') _mapId = '65b8d6f5cdde2479cb2a3125'; // Ground Zero
  return _mapId;
};

export const calculateHypotenuse = (
  p1: InteractiveMap.Position2D, p2: InteractiveMap.Position2D,
) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const image2realPos = (
  image: InteractiveMap.ImageProps = { width: 1, height: 1 },
  bounds: number[][],
): InteractiveMap.ImageTransformProps => {
  return {
    x: (pos: number) => {
      const xPer = pos / image.width;
      const xReal = xPer * (bounds[1][0] - bounds[0][0]) + bounds[0][0];
      return xReal;
    },
    y: (pos: number) => {
      const yPer = pos / image.height;
      const yReal = yPer * (bounds[1][1] - bounds[0][1]) + bounds[0][1];
      return yReal;
    },
    p: (pos: InteractiveMap.Position2D) => {
      const xPer = pos.x / image.width;
      const xReal = xPer * (bounds[1][0] - bounds[0][0]) + bounds[0][0];
      const yPer = pos.y / image.height;
      const yReal = yPer * (bounds[1][1] - bounds[0][1]) + bounds[0][1];
      return { x: xReal, y: yReal };
    },
  };
};

export const real2imagePos = (
  image: InteractiveMap.ImageProps = { width: 1, height: 1 },
  bounds: number[][],
): InteractiveMap.ImageTransformProps => {
  return {
    x: (pos: number) => {
      const xPer = (pos - bounds[0][0]) / (bounds[1][0] - bounds[0][0]);
      const xImage = xPer * image.width;
      return xImage;
    },
    y: (pos: number) => {
      const yPer = (pos - bounds[0][1]) / (bounds[1][1] - bounds[0][1]);
      const yImage = yPer * image.height;
      return yImage;
    },
    p: (pos: InteractiveMap.Position2D) => {
      const xPer = (pos.x - bounds[0][0]) / (bounds[1][0] - bounds[0][0]);
      const xImage = xPer * image.width;
      const yPer = (pos.y - bounds[0][1]) / (bounds[1][1] - bounds[0][1]);
      const yImage = yPer * image.height;
      return { x: xImage, y: yImage };
    },
  };
};

export const mouseHoverEvent = {
  onMouseOver: () => {
    const stage = document.querySelector('.im-stage') as HTMLCanvasElement;
    if (stage) {
      stage.style.cursor = 'url(\'/cursor/genshin-nahida-and-a-thousand-floating-dreams-cursor.png\'), pointer';
    }
  },
  onMouseLeave: () => {
    const stage = document.querySelector('.im-stage') as HTMLCanvasElement;
    if (stage) {
      stage.style.cursor = '';
    }
  },
};

export const mouseClickEvent = (props: MouseClickEvent) => {
  const { text, mapScale, position, offset, real2imagePos: r2iP } = props;
  return {
    onClick: (e: KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 0) {
        const stage = e.target.getStage();
        if (stage) {
          showTooltip({
            x:
              stage.x() +
              r2iP.x(position.x) * mapScale + (offset?.x || 0),
            y:
              stage.y() +
              r2iP.y(position.y) * mapScale + (offset?.y || 0),
            text,
          });
        }
      }
    },
    onTouchEnd: (e: KonvaEventObject<TouchEvent>) => {
      const stage = e.target.getStage();
      if (stage) {
        showTooltip({
          x:
            stage.x() +
            r2iP.x(position.x) * mapScale,
          y:
            stage.y() +
            r2iP.y(position.y) * mapScale,
          text,
        });
      }
    },
  };
};

export const getLayer = (name: string, layers: InteractiveMap.Layer[]) => {
  let layer;
  layers.forEach((_layer) => {
    if (_layer.name === name) {
      layer = _layer;
    }
  });
  return layer;
};
