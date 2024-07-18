import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useInterval, useLocalStorageState } from 'ahooks';
import classNames from 'classnames';
import numbro from 'numbro';
import { useRecoilState } from 'recoil';
import { message } from 'tilty-ui';
import { UAParser } from 'ua-parser-js';

import dataImap from '@/data/interactive_maps';
import langState from '@/store/lang';
import { tarkovGamePathResolve } from '@/utils/tarkov';

import useI18N from '../../i18n';
import Canvas from './components/Canvas';
import AdditionFunc from './components/UI/AdditionFunc';
import ContextMenu from './components/UI/ContextMenu';
import Coordinate from './components/UI/Coordinate';
import EFTWatcher from './components/UI/EFTWatcher';
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

  const [directoryHandler, setDirectoryHandler] = useState<FileSystemDirectoryHandle>();
  const [tarkovGamePathHandler, setTarkovGamePathHandler] = useState<FileSystemDirectoryHandle>();
  const [applicationLogsHandler, setApplicationLogsHandler] = useState<FileSystemFileHandle>();
  const [notificationsLogsHandler, setNotificationsLogsHandler] = useState<FileSystemFileHandle>();
  const applicationPathNameCache = useRef<string>();
  const notificationsPathNameCache = useRef<string>();
  const applicationModifiedGmt = useRef(0);
  const notificationsModifiedGmt = useRef(0);
  const applicationCacheLineNo = useRef(0);
  const notificationsCacheLineNo = useRef(0);

  const [raidInfo, setRaidInfo] = useState<InteractiveMap.RaidLogProps>();

  const [extracts, setExtracts] = useLocalStorageState<InteractiveMap.Faction[]>('im-extracts', {
    defaultValue: ['pmc', 'scav', 'shared'],
  });
  const [locks, setLocks] = useLocalStorageState<string[]>('im-locks', {
    defaultValue: ['lock'],
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

  const [lang] = useRecoilState(langState);

  const directoryFilesCache = useRef<string[]>([]);

  const { t } = useI18N(lang);

  const resolveDirectories = async (initial = false) => {
    if (initial) {
      directoryFilesCache.current = [];
    }
    if (directoryHandler) {
      initial && toast.info(`开始监听截图目录: ${directoryHandler.name}`);
      const entries = await (directoryHandler as any).entries();
      const files = [];
      for await (const [key] of entries) {
        files.push(key);
      }
      const diff = diffDirectories(files);
      if (diff.length > 0 && !initial) {
        const filename = diff[diff.length - 1];
        (window as any).interactUpdateLocation(filename);
      }
    }
  };

  const resolveTarkovGamePath = async () => {
    const { resolveGameRootPath, resolveLogPath, resolveLogFile } = tarkovGamePathResolve;
    if (tarkovGamePathHandler) {
      const gameRootPathHandle = await resolveGameRootPath(tarkovGamePathHandler);
      const logPathHandle = await resolveLogPath(gameRootPathHandle || tarkovGamePathHandler);
      if (logPathHandle) {
        const _applicationLogsHandler = await resolveLogFile(logPathHandle, 'application');
        if (_applicationLogsHandler) {
          if (applicationPathNameCache.current !== _applicationLogsHandler.name) {
            applicationPathNameCache.current = _applicationLogsHandler.name;
            setApplicationLogsHandler(_applicationLogsHandler);
            toast.info(`开始监听日志文件: ${_applicationLogsHandler.name}`);
          }
        }
        const _notificationsLogsHandler = await resolveLogFile(logPathHandle, 'notifications');
        if (_notificationsLogsHandler) {
          if (notificationsPathNameCache.current !== _notificationsLogsHandler.name) {
            notificationsPathNameCache.current = _notificationsLogsHandler.name;
            setNotificationsLogsHandler(_notificationsLogsHandler);
            toast.info(`开始监听日志文件: ${_notificationsLogsHandler.name}`);
          }
        }
      }
    } else {
      setApplicationLogsHandler(undefined);
      setNotificationsLogsHandler(undefined);
    }
  };

  const parseProfileInfo = (log: InteractiveMap.ProfileLogProps) => {
    setRaidInfo(undefined);
    toast.info(`载入角色ID: ${log.profileId}, 账户ID: ${log.accountId}`);
  };

  const parseRaidInfo = (log: InteractiveMap.RaidLogProps) => {
    setRaidInfo(log);
    toast.info(`载入战局信息: ${log.shortId}`);
    switch (log.location) {
      case 'TarkovStreets':
        setActiveMapId('5714dc692459777137212e12');
        setActiveLayer(undefined);
        break;
      case 'Sandbox':
        setActiveMapId('653e6760052c01c1c805532f');
        setActiveLayer(undefined);
        break;
      case 'Sandbox_high':
        setActiveMapId('65b8d6f5cdde2479cb2a3125');
        setActiveLayer(undefined);
        break;
      case 'bigmap':
        setActiveMapId('56f40101d2720b2a4d8b45d6');
        setActiveLayer(undefined);
        break;
      case 'factory4_day':
        setActiveMapId('55f2d3fd4bdc2d5f408b4567');
        setActiveLayer(undefined);
        break;
      case 'factory4_night':
        setActiveMapId('59fc81d786f774390775787e');
        setActiveLayer(undefined);
        break;
      case 'Interchange':
        setActiveMapId('5714dbc024597771384a510d');
        setActiveLayer(undefined);
        break;
      case 'laboratory':
        setActiveMapId('5b0fc42d86f7744a585f9105');
        setActiveLayer(undefined);
        break;
      case 'Lighthouse':
        setActiveMapId('5704e4dad2720bb55b8b4567');
        setActiveLayer(undefined);
        break;
      case 'RezervBase':
        setActiveMapId('5704e5fad2720bc05b8b4567');
        setActiveLayer(undefined);
        break;
      case 'Shoreline':
        setActiveMapId('5704e554d2720bac5b8b456e');
        setActiveLayer(undefined);
        break;
      case 'Woods':
        setActiveMapId('5704e3c2d2720bac5b8b4567');
        setActiveLayer(undefined);
        break;
      default:
        break;
    }
  };

  const parseFleaMarketInfo = (logs: any[]) => {
    logs.forEach((log) => {
      const { message: _message } = log || {};
      const { type, items, systemData } = _message || {};
      if (type === 4) {
        const { itemCount, soldItem, buyerNickname } = systemData || {};
        const { data: _data } = items || {};
        if (soldItem) {
          emitWithAck('/tarkov/v2/iMGetItemDetail', { id: soldItem, lang }).then(({ data }) => {
            const receivedItems: string[] = [];
            _data.forEach((d: any) => {
              const { _tpl, upd } = d || {};
              let unit = '卢布';
              if (_tpl === '5449016a4bdc2d6f028b456f') unit = '卢布';
              if (_tpl === '5696686a4bdc2da3298b456a') unit = '美元';
              if (_tpl === '569668774bdc2da2298b4568') unit = '欧元';
              receivedItems.push(
                `${numbro(upd?.StackObjectsCount || 0).format({
                  thousandSeparated: true,
                })}${unit}`,
              );
            });
            toast.success(
              `${buyerNickname}花费${receivedItems.join('和')}购买了你${itemCount}个${data.name}`,
              { autoClose: 15000 },
            );
          });
        }
      }
    });
  };

  const resolveApplicationLogs = async (initial = false) => {
    const { getLogFileMeta, parseLogFile, parseLine, parseProfileLine, parseRaidLine } =
      tarkovGamePathResolve;
    if (initial) {
      applicationModifiedGmt.current = 0;
      applicationCacheLineNo.current = 0;
    }
    if (applicationLogsHandler) {
      const metadata = await getLogFileMeta(applicationLogsHandler);
      if (metadata.lastModified > applicationModifiedGmt.current) {
        applicationModifiedGmt.current = metadata.lastModified;
        const logFile = await parseLogFile(applicationLogsHandler);
        const logs = parseLine(logFile);
        const newLogs = logs.splice(applicationCacheLineNo.current);
        applicationCacheLineNo.current += newLogs.length;
        const profileLogs = newLogs
          .map((log) => parseProfileLine(log))
          .filter((v) => v) as InteractiveMap.ProfileLogProps[];
        const raidLogs = newLogs
          .map((log) => parseRaidLine(log))
          .filter((v) => v) as InteractiveMap.RaidLogProps[];
        if (profileLogs.length > 0 && !initial) {
          console.log('Received new profile logs:', profileLogs);
          parseProfileInfo(profileLogs[profileLogs.length - 1]);
        }
        if (raidLogs.length > 0 && !initial) {
          console.log('Received new raid logs:', raidLogs);
          parseRaidInfo(raidLogs[raidLogs.length - 1]);
        }
      }
    }
  };

  const resolveNotificationsLogs = async (initial = false) => {
    const { getLogFileMeta, parseLogFile, parseLine, parseMessageLine } = tarkovGamePathResolve;
    if (initial) {
      notificationsModifiedGmt.current = 0;
      notificationsCacheLineNo.current = 0;
    }
    if (notificationsLogsHandler) {
      const metadata = await getLogFileMeta(notificationsLogsHandler);
      if (metadata.lastModified > notificationsModifiedGmt.current) {
        notificationsModifiedGmt.current = metadata.lastModified;
        const logFile = await parseLogFile(notificationsLogsHandler);
        const logs = parseLine(logFile);
        const newLogs = logs.splice(notificationsCacheLineNo.current);
        notificationsCacheLineNo.current += newLogs.length;
        const messageLogs = newLogs.map((log) => parseMessageLine(log)).filter((v) => v);
        if (messageLogs.length > 0 && !initial) {
          console.log('Received new message logs:', messageLogs);
          parseFleaMarketInfo(messageLogs);
        }
      }
    }
  };

  const diffDirectories = (files: string[]) => {
    const diff = files.filter((file) => !directoryFilesCache.current?.includes(file));
    directoryFilesCache.current = files;
    return diff;
  };

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

  const handleLocksChange = (_locks: string[]) => {
    setLocks(_locks);
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

  const handleClickEftWatcherPath = async () => {
    if (window.showDirectoryPicker) {
      try {
        const handler = await window.showDirectoryPicker();
        if (handler) {
          setDirectoryHandler(handler);
        }
      } catch (err) {
        setDirectoryHandler(undefined);
      }
    } else {
      message.show({ content: t('eftwatcher.unsupportMsg') });
    }
  };

  const handleClickTarkovGamePath = async () => {
    if (window.showDirectoryPicker) {
      try {
        const handler = await window.showDirectoryPicker();
        if (handler) {
          const result = await tarkovGamePathResolve.checkPath(handler);
          if (result) {
            setTarkovGamePathHandler(handler);
          } else {
            message.show({ content: '所选文件夹不是塔科夫游戏目录，请重新选择！' });
          }
        }
      } catch (err) {
        setTarkovGamePathHandler(undefined);
      }
    } else {
      message.show({ content: t('eftwatcher.unsupportMsg') });
    }
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
    toast.info('正在切换地图，请稍候...');
  };

  const handleLayerChange = (name: string) => {
    if (activeMap?.layers) {
      setActiveLayer(getLayer(name, activeMap.layers));
    }
  };

  useEffect(() => {
    if (activeMapId) {
      const data = dataImap.filter((v) => v.id === activeMapId)?.[0] as any;
      setActiveMap(data);
      toast.success(`地图已切换至${data.name}`);
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

  useEffect(() => {
    resolveDirectories(true);
  }, [directoryHandler]);

  useEffect(() => {
    if (tarkovGamePathHandler) {
      console.log(`File Watcher: ${tarkovGamePathHandler.name}`);
      resolveTarkovGamePath();
    }
  }, [tarkovGamePathHandler]);

  useEffect(() => {
    if (applicationLogsHandler) {
      console.log(`File Watcher: ${applicationLogsHandler.name}`);
      resolveApplicationLogs(true);
    }
  }, [applicationLogsHandler]);

  useEffect(() => {
    if (notificationsLogsHandler) {
      console.log(`File Watcher: ${notificationsLogsHandler.name}`);
      resolveNotificationsLogs(true);
    }
  }, [notificationsLogsHandler]);

  useEffect(() => {
    toast.info(t('toast.alert'), { autoClose: 10000 });
  }, []);

  useInterval(() => {
    if (directoryHandler) {
      resolveDirectories();
    }
    if (applicationLogsHandler) {
      resolveApplicationLogs();
    }
    if (notificationsLogsHandler) {
      resolveNotificationsLogs();
    }
  }, 1000);

  useInterval(() => {
    if (tarkovGamePathHandler) {
      resolveTarkovGamePath();
    }
  }, 10000);

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
            markerLocks={locks}
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
                  <MapInfo
                    mapData={activeMap}
                    raidInfo={raidInfo}
                    directoryHandler={directoryHandler}
                    tarkovGamePathHandler={tarkovGamePathHandler}
                    show={mapInfoActive}
                  />
                </div>
              )}
            </div>
            <div className="im-header-right">
              <div className="im-header-right-1">
                <QuickTools
                  activeMapId={activeMapId}
                  extracts={extracts}
                  locks={locks}
                  lootKeys={lootKeys}
                  spawns={spawns}
                  hazards={hazards}
                  stationaryWeapons={stationaryWeapons}
                  mapInfoActive={mapInfoActive}
                  lootContainers={activeMap.lootContainers}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  eraserWidth={eraserWidth}
                  directoryHandler={directoryHandler}
                  tarkovGamePathHandler={tarkovGamePathHandler}
                  locationScale={locationScale}
                  resolution={resolution}
                  isMobile={isMobile}
                  setQuickSearchShow={setQuickSearchShow}
                  onStrokeTypeChange={handleStrokeTypeChange}
                  onExtractsChange={handleExtractsChange}
                  onLocksChange={handleLocksChange}
                  onLootKeysChange={handleLootKeysChange}
                  onSpawnsChange={handleSpawnsChange}
                  onHazardsChange={handleHazardsChange}
                  onStationaryWeaponsChange={handleStationaryWeaponsChange}
                  onStrokeColorChange={handleStrokeColorChange}
                  onStrokeWidthChange={handleStrokeWidthChange}
                  onEraserWidthChange={handleEraserWidthChange}
                  onClickEftWatcherPath={handleClickEftWatcherPath}
                  onClickTarkovGamePathPath={handleClickTarkovGamePath}
                  onLocationScaleChange={handleLocationScaleChange}
                  onMapInfoActive={handleMapInfoActive}
                />
                {resolution.width > 1280 && <Coordinate {...utils} position={cursorPosition} />}
              </div>
              <div className="im-header-right-2">
                <AdditionFunc />
              </div>
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
        <EFTWatcher
          directoryHandler={directoryHandler}
          tarkovGamePathHandler={tarkovGamePathHandler}
          onClickEftWatcherPath={handleClickEftWatcherPath}
          onClickTarkovGamePath={handleClickTarkovGamePath}
        />
        <Warning />
      </div>
    );
  } else {
    return (
      <div className="im-loading">
        <img src="/images/tilty_logo_round_white.png" />
        <span>{t('interactive.mapLoading')}</span>
      </div>
    );
  }
};

export default Index;
