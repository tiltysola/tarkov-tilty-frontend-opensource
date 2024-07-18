import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage } from 'react-konva';

import { useInterval } from 'ahooks';
import { KonvaEventObject } from 'konva/lib/Node';
import type { Stage as StageType } from 'konva/lib/Stage';
import useImage from 'use-image';

import {
  calculateHypotenuse,
  image2realPos as _image2realPos,
  real2imagePos as _real2imagePos,
} from '@/pages/InteractiveMap/utils';

import BaseMap from '../BaseMap';
import DrawLines from '../DrawLines';
import Extracts from '../Extracts';
import Hazards from '../Hazards';
import Image from '../Image';
import Labels from '../Labels';
import Locks from '../Locks';
import LootContainers from '../LootContainers';
import PlayerLocation from '../PlayerLocation';
import Ruler from '../Ruler';
import Spawns from '../Spawns';
import StationaryWeapons from '../StationaryWeapons';
import { showContextMenu } from '../UI/ContextMenu';

import './style.less';

interface CanvasProps {
  mapData: InteractiveMap.Data;
  activeLayer: InteractiveMap.Layer | undefined;
  markerExtracts: InteractiveMap.Faction[];
  markerLocks: string[];
  markerLootKeys: string[];
  markerSpawns: string[];
  markerHazards: string[];
  markerStationaryWeapons: string[];
  locationScale: boolean;
  width: number;
  height: number;
  resolution: { width: number; height: number };
  onCursorPositionChange?: (cursorPosition: InteractiveMap.Position2D) => void;
  onRulerPositionChange?: (rulerPosition: InteractiveMap.Position2D[] | undefined) => void;
  callbackUtils?: (utils: InteractiveMap.UtilProps) => void;
}

const Index = (props: CanvasProps & InteractiveMap.DrawProps) => {
  const {
    mapData,
    activeLayer,
    markerExtracts,
    markerLocks,
    markerLootKeys,
    markerSpawns,
    markerHazards,
    markerStationaryWeapons,
    locationScale,
    width,
    height,
    strokeType,
    strokeColor,
    strokeWidth,
    eraserWidth,
    resolution,
    onCursorPositionChange,
    onRulerPositionChange,
    callbackUtils,
  } = props;

  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [mapMoveStatus, setMapMoveStatus] = useState<Set<'w' | 'a' | 's' | 'd'>>();
  const [mapScale, setMapScale] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [drawLines, setDrawLines] = useState<InteractiveMap.iMDrawLine[]>([]);
  const [drawTempPoints, setDrawTempPoints] = useState<number[]>([]);
  const [rulerPosition, setRulerPosition] = useState<InteractiveMap.Position2D[]>();

  const stageRef = useRef<StageType>(null);
  const operationType = useRef<InteractiveMap.OperationType>(-1);
  const operationContext = useRef(false);
  const operationInitialStage = useRef<InteractiveMap.Position2D>();
  const operationInitialScale = useRef(0);
  const operationInitialVal = useRef([{ x: 0, y: 0, pageX: 0, pageY: 0 }]);
  const touchTouches = useRef(0);

  const [baseMap, baseMapStatus] = useImage(mapData.svgPath);

  const baseScale = baseMap ? (baseMap.width + baseMap.height) / 1024 : 1;
  const heightRange = useMemo(() => {
    let _heightRange = [mapData.heightRange?.[0] || -1000, mapData.heightRange?.[1] || 1000];
    if (activeLayer) {
      _heightRange = activeLayer.extents[0].height;
    }
    return _heightRange;
  }, [activeLayer]);

  const image2realPos = useMemo(() => {
    return _image2realPos(baseMap, mapData.bounds);
  }, [baseMap, mapData]);
  const real2imagePos = useMemo(() => {
    return _real2imagePos(baseMap, mapData.bounds);
  }, [baseMap, mapData]);

  const utils: InteractiveMap.UtilProps = {
    baseMapStatus,
    baseScale,
    mapScale,
    activeLayer,
    heightRange,
    image2realPos,
    real2imagePos,
  };

  const scaleAccepted = (_scale: number) => {
    if (stageRef.current && baseMap) {
      const scaleX = stageRef.current.width() / baseMap.width;
      const scaleY = stageRef.current.height() / baseMap.height;
      const _baseScale = scaleX < scaleY ? scaleX : scaleY;
      if (_scale < _baseScale / 2) {
        return false;
      } else if (_scale > _baseScale * 6) {
        return false;
      }
    }
    return true;
  };

  const updateCursorPosition = () => {
    const stage = stageRef.current;
    if (stage) {
      const position = stage.getPointerPosition();
      if (position) {
        const mousePointTo = {
          x: (position.x - stage.x()) / mapScale,
          y: (position.y - stage.y()) / mapScale,
        };
        setCursorPosition(mousePointTo);
      }
    }
  };

  const handlePlayerLocationChange = (
    playerLocation: InteractiveMap.Position & { mapId: string },
  ) => {
    const { x, z, mapId } = playerLocation;
    if (stageRef.current && baseMap && mapId === mapData.id) {
      if (locationScale) {
        const scaleX = stageRef.current.width() / baseMap.width;
        const scaleY = stageRef.current.height() / baseMap.height;
        const _baseScale = scaleX < scaleY ? scaleX : scaleY;
        setMapScale(_baseScale * 3);
        setMapPosition({
          x: stageRef.current.width() / 2 - real2imagePos.x(x) * _baseScale * 3,
          y: stageRef.current.height() / 2 - real2imagePos.y(z) * _baseScale * 3,
        });
      } else {
        setMapScale(mapScale);
        setMapPosition({
          x: stageRef.current.width() / 2 - real2imagePos.x(x) * mapScale,
          y: stageRef.current.height() / 2 - real2imagePos.y(z) * mapScale,
        });
      }
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      // 初始化
      operationType.current = e.evt.button as InteractiveMap.OperationType;
      if (!operationInitialStage.current) {
        operationInitialStage.current = { x: stage.x(), y: stage.y() };
      }
      if (operationInitialScale.current === 0) {
        operationInitialScale.current = mapScale;
      }
      operationInitialVal.current = [
        {
          x: (e.evt.pageX - stage.x()) / operationInitialScale.current,
          y: (e.evt.pageY - stage.y()) / operationInitialScale.current,
          pageX: e.evt.pageX,
          pageY: e.evt.pageY,
        },
      ];
      // 初始化
      if (e.evt.button === 2) operationContext.current = true;
      if (strokeType === 'draw' || strokeType === 'eraser') {
        setDrawTempPoints([operationInitialVal.current[0].x, operationInitialVal.current[0].y]);
      } else if (strokeType === 'ruler' && e.evt.button === 0) {
        setRulerPosition(undefined);
      }
    }
  };

  const handleTouchStart = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (stage) {
      // 初始化
      if (e.evt.touches.length > touchTouches.current) {
        touchTouches.current = e.evt.touches.length;
      }
      if (!operationInitialStage.current) {
        operationInitialStage.current = { x: stage.x(), y: stage.y() };
      }
      if (operationInitialScale.current === 0) {
        operationInitialScale.current = mapScale;
      }
      const _operationInitialVal = [];
      for (let i = 0; i < e.evt.touches.length; i++) {
        const touch = e.evt.touches[i];
        _operationInitialVal.push({
          x: (touch.pageX - stage.x()) / operationInitialScale.current,
          y: (touch.pageY - stage.y()) / operationInitialScale.current,
          pageX: touch.pageX,
          pageY: touch.pageY,
        });
      }
      operationInitialVal.current = _operationInitialVal;
      // 初始化
      if (strokeType === 'ruler') setRulerPosition(undefined);
    }
    updateCursorPosition();
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (operationInitialStage.current) {
      if (operationType.current !== -1) {
        const final = {
          x: (e.evt.pageX - operationInitialStage.current.x) / operationInitialScale.current,
          y: (e.evt.pageY - operationInitialStage.current.y) / operationInitialScale.current,
          pageX: e.evt.pageX,
          pageY: e.evt.pageY,
        };
        if (strokeType === 'drag' || [1, 2].includes(operationType.current)) {
          setMapPosition({
            x:
              operationInitialStage.current.x +
              (final.pageX - operationInitialVal.current[0].pageX),
            y:
              operationInitialStage.current.y +
              (final.pageY - operationInitialVal.current[0].pageY),
          });
        } else if (strokeType === 'draw' || strokeType === 'eraser') {
          setDrawTempPoints([...drawTempPoints, final.x, final.y]);
        } else if (strokeType === 'ruler') {
          setRulerPosition([operationInitialVal.current[0], final]);
        }
      }
    }
    operationContext.current = false;
    updateCursorPosition();
  };

  const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    if (operationInitialStage.current) {
      if (e.evt.touches.length > touchTouches.current) {
        touchTouches.current = e.evt.touches.length;
      }
      const finals = [];
      for (let i = 0; i < e.evt.touches.length; i++) {
        const touch = e.evt.touches[i];
        finals.push({
          x: (touch.pageX - operationInitialStage.current.x) / operationInitialScale.current,
          y: (touch.pageY - operationInitialStage.current.y) / operationInitialScale.current,
          pageX: touch.pageX,
          pageY: touch.pageY,
        });
      }
      if (touchTouches.current === 1) {
        if (strokeType === 'drag') {
          setMapPosition({
            x:
              operationInitialStage.current.x +
              (finals[0].pageX - operationInitialVal.current[0].pageX),
            y:
              operationInitialStage.current.y +
              (finals[0].pageY - operationInitialVal.current[0].pageY),
          });
        } else if (strokeType === 'ruler') {
          setRulerPosition([operationInitialVal.current[0], finals[0]]);
        }
      } else if (touchTouches.current === 2) {
        const initialHypotenuse = calculateHypotenuse(
          operationInitialVal.current[0],
          operationInitialVal.current[1],
        );
        const finalHypotenuse = calculateHypotenuse(finals[0], finals[1]);
        const deltaLength = finalHypotenuse - initialHypotenuse;
        let newScale = operationInitialScale.current;
        const scale = 1 + deltaLength / initialHypotenuse;
        newScale = operationInitialScale.current * scale;
        if (scaleAccepted(newScale)) {
          setMapScale(newScale);
          const centerPoint = {
            x: (operationInitialVal.current[0].x + operationInitialVal.current[1].x) / 2,
            y: (operationInitialVal.current[0].y + operationInitialVal.current[1].y) / 2,
          };
          setMapPosition({
            x:
              (operationInitialVal.current[0].pageX + operationInitialVal.current[1].pageX) / 2 -
              centerPoint.x * newScale,
            y:
              (operationInitialVal.current[0].pageY + operationInitialVal.current[1].pageY) / 2 -
              centerPoint.y * newScale,
          });
        }
      }
      updateCursorPosition();
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (operationContext.current) showContextMenu({ x: e.evt.clientX, y: e.evt.clientY });
    if ((strokeType === 'draw' || strokeType === 'eraser') && drawTempPoints.length > 0) {
      const _strokeWidth = strokeType === 'draw' ? strokeWidth : eraserWidth;
      const data = {
        tool: strokeType,
        mapId: mapData.id,
        points: drawTempPoints,
        strokeColor,
        strokeWidth: _strokeWidth,
        shadowWidth: _strokeWidth,
      };
      setDrawLines([...drawLines, data as any]);
    }
    // 初始化
    operationInitialStage.current = undefined;
    operationInitialScale.current = 0;
    operationInitialVal.current = [{ x: 0, y: 0, pageX: 0, pageY: 0 }];
    operationType.current = -1;
    operationContext.current = false;
    setDrawTempPoints([]);
    // 初始化
  };

  const handleTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
    if (e.evt.touches.length === 0) {
      // 初始化
      operationInitialStage.current = undefined;
      operationInitialScale.current = 0;
      operationInitialVal.current = [{ x: 0, y: 0, pageX: 0, pageY: 0 }];
      touchTouches.current = 0;
      // 初始化
    }
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (stage) {
      const direction = e.evt.deltaY < 0 ? 1 : -1;
      const newScale = direction > 0 ? mapScale * 1.2 : mapScale / 1.2;
      if (scaleAccepted(newScale)) {
        setMapScale(newScale);
        const pointer = stage.getPointerPosition();
        if (pointer) {
          const mousePointTo = {
            x: (pointer.x - stage.x()) / mapScale,
            y: (pointer.y - stage.y()) / mapScale,
          };
          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };
          setMapPosition(newPos);
        }
      }
    }
  };

  const handleContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    // showContextMenu({ x: e.evt.clientX, y: e.evt.clientY });
  };

  useEffect(() => {
    if (stageRef.current) {
      if (baseMap && baseMapStatus === 'loaded') {
        const scaleX = stageRef.current.width() / baseMap.width;
        const scaleY = stageRef.current.height() / baseMap.height;
        const newScale = scaleX < scaleY ? scaleX : scaleY;
        setMapScale(newScale);
        setMapPosition({
          x: (stageRef.current.width() - baseMap.width * newScale) / 2,
          y: (stageRef.current.height() - baseMap.height * newScale) / 2,
        });
        setCursorPosition({ x: 0, y: 0 });
      } else {
        setMapScale(1);
        setMapPosition({
          x: (stageRef.current.width() - width) / 2,
          y: (stageRef.current.height() - height) / 2,
        });
        setCursorPosition({ x: 0, y: 0 });
        setRulerPosition(undefined);
      }
    }
  }, [baseMap, baseMapStatus, resolution]);

  useEffect(() => {
    onCursorPositionChange?.(cursorPosition);
  }, [cursorPosition]);

  useEffect(() => {
    onRulerPositionChange?.(rulerPosition);
  }, [rulerPosition]);

  useEffect(() => {
    callbackUtils?.(utils);
  }, [baseMapStatus, baseScale, mapScale, activeLayer, heightRange, image2realPos, real2imagePos]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        if (target.tagName === 'INPUT') return;
      }
      const _mapMoveStatus = new Set(mapMoveStatus || []);
      if (!e.ctrlKey && e.key === 'w') {
        _mapMoveStatus.add('w');
      } else if (!e.ctrlKey && e.key === 'a') {
        _mapMoveStatus.add('a');
      } else if (!e.ctrlKey && e.key === 's') {
        _mapMoveStatus.add('s');
      } else if (!e.ctrlKey && e.key === 'd') {
        _mapMoveStatus.add('d');
      }
      setMapMoveStatus(_mapMoveStatus);
    };
    const keyup = (e: KeyboardEvent) => {
      const _mapMoveStatus = new Set(mapMoveStatus || []);
      if (!e.ctrlKey && e.key === 'w') {
        _mapMoveStatus.delete('w');
      } else if (!e.ctrlKey && e.key === 'a') {
        _mapMoveStatus.delete('a');
      } else if (!e.ctrlKey && e.key === 's') {
        _mapMoveStatus.delete('s');
      } else if (!e.ctrlKey && e.key === 'd') {
        _mapMoveStatus.delete('d');
      }
      setMapMoveStatus(_mapMoveStatus);
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
  }, [mapMoveStatus]);

  useInterval(() => {
    const _mapPosition = { ...mapPosition };
    const step = 20;
    if (mapMoveStatus?.has('w')) {
      _mapPosition.y -= step;
    }
    if (mapMoveStatus?.has('a')) {
      _mapPosition.x -= step;
    }
    if (mapMoveStatus?.has('s')) {
      _mapPosition.y += step;
    }
    if (mapMoveStatus?.has('d')) {
      _mapPosition.x += step;
    }
    if (mapMoveStatus && mapMoveStatus.size > 0) {
      setMapPosition(_mapPosition);
    }
  }, 1000 / 60);

  return (
    <Stage
      className="im-stage"
      width={width}
      height={height}
      scale={{ x: mapScale, y: mapScale }}
      position={mapPosition}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      ref={stageRef}
    >
      <Layer id="im-layer-basemap">
        <Rect
          id="im-background"
          x={0}
          y={0}
          width={baseMap?.width}
          height={baseMap?.height}
          fill="#00000028"
        />
        <BaseMap
          id="im-basemap"
          baseMap={baseMap}
          activeLayer={activeLayer}
          status={baseMapStatus}
          coordinateRotation={mapData.coordinateRotation}
          resolution={{ width, height }}
        />
        {activeLayer && <Image id="im-layermap" imageSrc={activeLayer.svgPath} />}
        <Labels {...utils} labels={mapData.labels} show />
        <LootContainers {...utils} lootContainers={mapData.lootContainers} show={markerLootKeys} />
        <StationaryWeapons
          {...utils}
          stationaryWeapons={mapData.stationaryWeapons}
          show={markerStationaryWeapons}
        />
        <Spawns {...utils} baseMap={mapData} spawns={mapData.spawns} show={markerSpawns} />
        <Hazards {...utils} hazards={mapData.hazards} show={markerHazards} />
        <Extracts {...utils} extracts={mapData.extracts} show={markerExtracts} />
        <Locks {...utils} locks={mapData.locks} show={markerLocks} />
        <PlayerLocation
          {...utils}
          activeMapId={mapData.id}
          show={['playerLocation']}
          onPlayerLocationChange={handlePlayerLocationChange}
        />
      </Layer>
      {/* Stroke */}
      <Layer>
        <DrawLines
          {...utils}
          cursorPosition={cursorPosition}
          drawLines={drawLines}
          strokeType={strokeType}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          eraserWidth={eraserWidth}
          activeMapId={mapData.id}
          drawTempPoints={drawTempPoints}
          show={['drawLine']}
        />
      </Layer>
      {/* Tools */}
      <Layer>
        <Group>
          <Ruler {...utils} rulerPosition={rulerPosition} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default Index;
