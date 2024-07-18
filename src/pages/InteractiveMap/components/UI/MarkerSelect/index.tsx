import classNames from 'classnames';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import { getIconCDN, getLoot } from '@/pages/InteractiveMap/utils';

import './style.less';

export interface MarkerSelectProps {
  extracts: string[];
  locks: string[];
  lootKeys: string[];
  spawns: string[];
  hazards: string[];
  stationaryWeapons: string[];
  lootContainers: InteractiveMap.LootContainer[];
  onExtractsChange: (extracts: InteractiveMap.Faction[]) => void;
  onLocksChange: (locks: string[]) => void;
  onLootKeysChange: (lootKeys: string[]) => void;
  onSpawnsChange: (hazards: string[]) => void;
  onHazardsChange: (hazards: string[]) => void;
  onStationaryWeaponsChange: (hazards: string[]) => void;
}

const Index = (props: MarkerSelectProps) => {
  const {
    extracts,
    locks,
    lootKeys,
    spawns,
    hazards,
    stationaryWeapons,
    lootContainers,
    onExtractsChange,
    onLocksChange,
    onLootKeysChange,
    onSpawnsChange,
    onHazardsChange,
    onStationaryWeaponsChange,
  } = props;

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleToggleExtract = (_extract: string) => {
    if (extracts.includes(_extract)) {
      onExtractsChange?.(extracts.filter((e) => e !== _extract) as InteractiveMap.Faction[]);
    } else {
      onExtractsChange?.([...extracts, _extract] as InteractiveMap.Faction[]);
    }
  };

  const handleToggleLock = (_lock: string) => {
    if (locks.includes(_lock)) {
      onLocksChange?.(locks.filter((e) => e !== _lock));
    } else {
      onLocksChange?.([...locks, _lock]);
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
        <span>{t('marker.extracts')}</span>
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
        <span>{t('marker.legends')}</span>
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
        <span>{t('marker.spawns')}</span>
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
        <span>{t('marker.others')}</span>
      </div>
      <div className="im-quicktools-modal-marker-block">
        <div className="im-quicktools-modal-marker-block-list">
          {['lock'].map((lock) => {
            return (
              <img
                className={classNames({
                  active: locks.includes(lock),
                })}
                src={getIconCDN('lock')}
                onClick={() => handleToggleLock(lock)}
              />
            );
          })}
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
