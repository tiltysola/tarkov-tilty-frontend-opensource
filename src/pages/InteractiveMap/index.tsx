import { useEffect, useState } from 'react';

import { useLocalStorageState } from 'ahooks';
import classNames from 'classnames';
import { UAParser } from 'ua-parser-js';

import dataImap from '@/data/interactive_maps';

import Canvas from './components/Canvas';
import ContextMenu from './components/UI/ContextMenu';
import Coordinate from './components/UI/Coordinate';
import MapInfo from './components/UI/MapInfo';
import MapSelect from './components/UI/MapSelect';
import QuickSearch from './components/UI/QuickSearch';
import QuickTools from './components/UI/QuickTools';
import RulerPosition from './components/UI/RulerPosition';
import Title from './components/UI/Title';
import Tooltip from './components/UI/Tooltip';
import Warning from './components/UI/Warning';
import { getLayer } from './utils';

import './style.less';

const Index = () => {
  const [mapList, setMapList] = useState<InteractiveMap.Data[]>([]);
  const [activeMapId, setActiveMapId] = useState<string>();
  const [activeMap, setActiveMap] = useState<InteractiveMap.Data>();
  const [activeLayer, setActiveLayer] = useState<InteractiveMap.Layer>();
  const [utils, setUtils] = useState<InteractiveMap.UtilProps>();

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [rulerPosition, setRulerPosition] = useState<InteractiveMap.Position2D[]>();
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  const [simpleUIMode, setSimpleUIMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [extracts, setExtracts] = useLocalStorageState<InteractiveMap.Faction[]>('im-extracts', {
    defaultValue: ['pmc', 'scav', 'shared'],
  });
  const [lootKeys, setLootKeys] = useLocalStorageState<string[]>('im-lootKeys', {
    defaultValue: ['safe', 'jacket', 'pc-block', 'cache', 'medcase', 'plastic-suitcase'],
  });
  const [spawns, setSpawns] = useLocalStorageState<string[]>('im-spawns', {
    defaultValue: ['scav', 'sniper_scav', 'boss'],
  });
  const [hazards, setHazards] = useLocalStorageState<string[]>('im-hazards', {
    defaultValue: ['hazard'],
  });
  const [stationaryWeapons, setStationaryWeapons] = useLocalStorageState<string[]>(
    'im-stationaryWeapons',
    {
      defaultValue: [],
    },
  );
  const [mapInfoActive, setMapInfoActive] = useLocalStorageState<boolean>('im-mapInfoActive', {
    defaultValue: true,
  });
  const [locationScale, setLocationScale] = useLocalStorageState<boolean>('im-locationScale', {
    defaultValue: true,
  });

  const [strokeType, setStrokeType] = useState<InteractiveMap.StrokeType>('drag');
  const [strokeColor, setStrokeColor] = useLocalStorageState<string>('im-strokeColor', {
    defaultValue: '#9a8866',
  });
  const [strokeWidth, setStrokeWidth] = useLocalStorageState<number>('im-strokeWidth', {
    defaultValue: 1,
  });
  const [eraserWidth, setEraserWidth] = useLocalStorageState<number>('im-eraserWidth', {
    defaultValue: 5,
  });

  const [quickSearchShow, setQuickSearchShow] = useState(false);

  const handleCursorPositionChange = (_cursorPosition: InteractiveMap.Position2D) => {
    setCursorPosition(_cursorPosition);
  };

  const handleRulerPositionChange = (_rulerPosition: InteractiveMap.Position2D[] | undefined) => {
    setRulerPosition(_rulerPosition);
  };

  const handleCallbackUtils = (_utils: InteractiveMap.UtilProps) => {
    setUtils(_utils);
  };

  const handleExtractsChange = (_extracts: InteractiveMap.Faction[]) => {
    setExtracts(_extracts);
  };

  const handleLootKeysChange = (_lootKeys: string[]) => {
    setLootKeys(_lootKeys);
  };

  const handleSpawnsChange = (_spawns: string[]) => {
    setSpawns(_spawns);
  };

  const handleHazardsChange = (_hazards: string[]) => {
    setHazards(_hazards);
  };

  const handleStationaryWeaponsChange = (_stationaryWeapons: string[]) => {
    setStationaryWeapons(_stationaryWeapons);
  };

  const handleMapInfoActive = (_mapInfoActive: boolean) => {
    setMapInfoActive(_mapInfoActive);
  };

  const handleLocationScaleChange = (_b: boolean) => {
    setLocationScale(_b);
  };

  const handleStrokeTypeChange = (_strokeType: InteractiveMap.StrokeType) => {
    setStrokeType(_strokeType);
  };

  const handleStrokeColorChange = (_color: string) => {
    setStrokeColor(_color);
  };

  const handleStrokeWidthChange = (_width: number) => {
    setStrokeWidth(_width);
  };

  const handleEraserWidthChange = (_width: number) => {
    setEraserWidth(_width);
  };

  const handleMapChange = (mapId: string) => {
    setActiveMapId(mapId);
    setActiveLayer(undefined);
  };

  const handleLayerChange = (name: string) => {
    if (activeMap?.layers) {
      setActiveLayer(getLayer(name, activeMap.layers));
    }
  };

  useEffect(() => {
    if (activeMapId) {
      setActiveMap(dataImap.filter((v) => v.id === activeMapId)?.[0] as any);
    }
  }, [activeMapId]);

  useEffect(() => {
    if (mapList[0]?.id) {
      setActiveMapId(mapList[0].id);
    }
  }, [mapList]);

  useEffect(() => {
    setMapList(dataImap as any);
  }, []);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        setQuickSearchShow(true);
      } else if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setSimpleUIMode(!simpleUIMode);
      }
    };
    const resize = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const height = window.innerHeight || document.documentElement.clientHeight;
      setResolution({ width, height });
      const userAgent = new UAParser();
      const _isMobile = ['mobile', 'tablet'].includes(userAgent.getDevice().type || '');
      setIsMobile(_isMobile);
    };
    const unload = (e: BeforeUnloadEvent) => {
      if (self === top) {
        e.preventDefault();
        return false;
      }
    };
    resize();
    window.addEventListener('keydown', keydown);
    window.addEventListener('resize', resize);
    window.addEventListener('beforeunload', unload);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('resize', resize);
      window.removeEventListener('beforeunload', unload);
    };
  }, [simpleUIMode]);

  if (activeMap) {
    return (
      <div
        className={classNames({
          desktop: !isMobile,
          mobile: isMobile,
          'simple-ui-mode': simpleUIMode,
        })}
      >
        <div onContextMenu={(e) => e.preventDefault()}>
          <Canvas
            {...resolution}
            mapData={activeMap}
            activeLayer={activeLayer}
            markerExtracts={extracts}
            markerLootKeys={lootKeys}
            markerSpawns={spawns}
            markerHazards={hazards}
            markerStationaryWeapons={stationaryWeapons}
            locationScale={locationScale}
            strokeType={strokeType}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            eraserWidth={eraserWidth}
            resolution={resolution}
            onCursorPositionChange={handleCursorPositionChange}
            onRulerPositionChange={handleRulerPositionChange}
            callbackUtils={handleCallbackUtils}
          />
          <div className="im-header">
            <div className="im-header-left">
              <div className="im-header-left-1">
                <Title />
                {resolution.width > 750 && (
                  <MapSelect
                    mapList={mapList}
                    activeMap={activeMap}
                    activeLayer={activeLayer?.name}
                    onMapChange={handleMapChange}
                    onLayerChange={handleLayerChange}
                  />
                )}
              </div>
              {(isMobile || resolution.width >= 420) && (
                <div className="im-header-left-2">
                  <MapInfo mapData={activeMap} show={mapInfoActive} />
                </div>
              )}
            </div>
            <div className="im-header-right">
              <QuickTools
                extracts={extracts}
                lootKeys={lootKeys}
                spawns={spawns}
                hazards={hazards}
                stationaryWeapons={stationaryWeapons}
                mapInfoActive={mapInfoActive}
                lootContainers={activeMap.lootContainers}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                eraserWidth={eraserWidth}
                locationScale={locationScale}
                resolution={resolution}
                isMobile={isMobile}
                setQuickSearchShow={setQuickSearchShow}
                onStrokeTypeChange={handleStrokeTypeChange}
                onExtractsChange={handleExtractsChange}
                onLootKeysChange={handleLootKeysChange}
                onSpawnsChange={handleSpawnsChange}
                onHazardsChange={handleHazardsChange}
                onStationaryWeaponsChange={handleStationaryWeaponsChange}
                onStrokeColorChange={handleStrokeColorChange}
                onStrokeWidthChange={handleStrokeWidthChange}
                onEraserWidthChange={handleEraserWidthChange}
                onLocationScaleChange={handleLocationScaleChange}
                onMapInfoActive={handleMapInfoActive}
              />
              {resolution.width > 1280 && <Coordinate {...utils} position={cursorPosition} />}
            </div>
          </div>
          <div className="im-footer">
            <div className="im-footer-left">
              {resolution.width <= 750 && (
                <MapSelect
                  mapList={mapList}
                  activeMap={activeMap}
                  activeLayer={activeLayer?.name}
                  onMapChange={handleMapChange}
                  onLayerChange={handleLayerChange}
                />
              )}
            </div>
            <div className="im-footer-right">
              <RulerPosition {...utils} rulerPosition={rulerPosition} />
              {resolution.width <= 1280 && <Coordinate {...utils} position={cursorPosition} />}
            </div>
          </div>
        </div>
        <Tooltip {...resolution} />
        <ContextMenu />
        <QuickSearch show={quickSearchShow} onHide={() => setQuickSearchShow(false)} />
        <Warning />
      </div>
    );
  } else {
    return (
      <div className="im-loading">
        <img src="/images/tilty_logo_round_white.png" />
        <span>互动地图载入中...</span>
      </div>
    );
  }
};

export default Index;
