import classNames from 'classnames';

import { getIconCDN, getLoot } from '@/pages/InteractiveMap/utils';

import './style.less';

export interface MarkerSelectProps {
  extracts: string[];
  lootKeys: string[];
  spawns: string[];
  hazards: string[];
  stationaryWeapons: string[];
  lootContainers: InteractiveMap.LootContainer[];
  onExtractsChange: (extracts: InteractiveMap.Faction[]) => void;
  onLootKeysChange: (lootKeys: string[]) => void;
  onSpawnsChange: (hazards: string[]) => void;
  onHazardsChange: (hazards: string[]) => void;
  onStationaryWeaponsChange: (hazards: string[]) => void;
}

const Index = (props: MarkerSelectProps) => {
  const {
    extracts,
    lootKeys,
    spawns,
    hazards,
    stationaryWeapons,
    lootContainers,
    onExtractsChange,
    onLootKeysChange,
    onSpawnsChange,
    onHazardsChange,
    onStationaryWeaponsChange,
  } = props;

  const handleToggleExtract = (_extract: string) => {
    if (extracts.includes(_extract)) {
      onExtractsChange?.(extracts.filter((e) => e !== _extract) as InteractiveMap.Faction[]);
    } else {
      onExtractsChange?.([...extracts, _extract] as InteractiveMap.Faction[]);
    }
  };

  const handleToggleLootKey = (_lootKey: string) => {
    if (lootKeys.includes(_lootKey)) {
      onLootKeysChange?.(lootKeys.filter((lK) => lK !== _lootKey));
    } else {
      onLootKeysChange?.([...lootKeys, _lootKey]);
    }
  };

  const handleToggleSpawns = (_spawn: string) => {
    if (spawns.includes(_spawn)) {
      onSpawnsChange?.(spawns.filter((h) => h !== _spawn));
    } else {
      onSpawnsChange?.([...spawns, _spawn]);
    }
  };

  const handleToggleHazard = (_hazard: string) => {
    if (hazards.includes(_hazard)) {
      onHazardsChange?.(hazards.filter((h) => h !== _hazard));
    } else {
      onHazardsChange?.([...hazards, _hazard]);
    }
  };

  const handleToggleStationaryWeapon = (_stationaryWeapon: string) => {
    if (stationaryWeapons.includes(_stationaryWeapon)) {
      onStationaryWeaponsChange?.(stationaryWeapons.filter((h) => h !== _stationaryWeapon));
    } else {
      onStationaryWeaponsChange?.([...stationaryWeapons, _stationaryWeapon]);
    }
  };

  return (
    <div className="im-quicktools-modal-marker" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-marker-title">
        <span>撤离点</span>
      </div>
      <div className="im-quicktools-modal-marker-block">
        <div className="im-quicktools-modal-marker-block-list">
          {['pmc', 'scav', 'shared'].map((faction) => {
            return (
              <img
                className={classNames({
                  active: extracts.includes(faction),
                })}
                src={getIconCDN(`extract_${faction}`)}
                onClick={() => handleToggleExtract(faction)}
              />
            );
          })}
        </div>
      </div>
      <div className="im-quicktools-modal-marker-title">
        <span>图例</span>
      </div>
      {['Valuable', 'Good', 'Common'].map((type) => {
        return (
          getLoot(type, lootContainers).length > 0 && (
            <div className="im-quicktools-modal-marker-block">
              <div className="im-quicktools-modal-marker-block-title">
                <span>{type}</span>
              </div>
              <div className="im-quicktools-modal-marker-block-list">
                {getLoot(type, lootContainers).map((loot) => {
                  return (
                    <img
                      className={classNames({
                        active: lootKeys.includes(loot.key),
                      })}
                      src={getIconCDN(`container_${loot.value[0]}`)}
                      onClick={() => handleToggleLootKey(loot.key)}
                    />
                  );
                })}
              </div>
            </div>
          )
        );
      })}
      <div className="im-quicktools-modal-marker-title">
        <span>出生点</span>
      </div>
      <div className="im-quicktools-modal-marker-block">
        <div className="im-quicktools-modal-marker-block-list">
          {['scav', 'sniper_scav', 'boss', 'pmc'].map((type) => {
            return (
              <img
                className={classNames({
                  active: spawns.includes(type),
                })}
                src={getIconCDN(`spawn_${type}`)}
                onClick={() => handleToggleSpawns(type)}
              />
            );
          })}
        </div>
      </div>
      <div className="im-quicktools-modal-marker-title">
        <span>危险区</span>
      </div>
      <div className="im-quicktools-modal-marker-block">
        <div className="im-quicktools-modal-marker-block-list">
          {['hazard'].map((hazard) => {
            return (
              <img
                className={classNames({
                  active: hazards.includes(hazard),
                })}
                src={getIconCDN('hazard')}
                onClick={() => handleToggleHazard(hazard)}
              />
            );
          })}
        </div>
      </div>
      <div className="im-quicktools-modal-marker-title">
        <span>固定武器</span>
      </div>
      <div className="im-quicktools-modal-marker-block">
        <div className="im-quicktools-modal-marker-block-list">
          {['stationaryWeapon'].map((stationaryWeapon) => {
            return (
              <img
                className={classNames({
                  active: stationaryWeapons.includes(stationaryWeapon),
                })}
                src={getIconCDN('stationarygun')}
                onClick={() => handleToggleStationaryWeapon(stationaryWeapon)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
