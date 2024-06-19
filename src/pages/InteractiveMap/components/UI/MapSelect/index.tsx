import { useState } from 'react';

import classNames from 'classnames';

import Icon from '@/components/Icon';

import './style.less';

interface MapSelectProps {
  mapList: InteractiveMap.Data[];
  activeMap: InteractiveMap.Data;
  activeLayer: string | undefined;
  onMapChange: (mapId: string) => void;
  onLayerChange: (layer: string) => void;
}

const Index = (props: MapSelectProps) => {
  const { mapList, activeMap, activeLayer, onMapChange, onLayerChange } = props;

  const [mapSelectActive, setMapSelectActive] = useState(false);
  const [layerSelectActive, setLayerSelectActive] = useState(false);

  const handleMapSelect = () => {
    setLayerSelectActive(false);
    setMapSelectActive(!mapSelectActive);
  };

  const handleLayerSelect = () => {
    setMapSelectActive(false);
    setLayerSelectActive(!layerSelectActive);
  };

  const handleMapChange = (mapId: string) => {
    onMapChange?.(mapId);
    setMapSelectActive(false);
  };

  const handleLayerChange = (name: string) => {
    onLayerChange?.(name);
    setLayerSelectActive(false);
  };

  return (
    <div className="im-mapselect">
      <div className="im-mapselect-base">
        <div className="im-mapselect-base-surface" onClick={handleMapSelect}>
          <span>{activeMap.name || '选择地图'}</span>
          <span className="im-mapselect-base-surface-arrow">
            {mapSelectActive ? (
              <Icon type="icon-arrow-drop-up-fill" />
            ) : (
              <Icon type="icon-arrow-drop-down-fill" />
            )}
          </span>
        </div>
        <div
          className={classNames('im-mapselect-base-dropdown', {
            active: mapSelectActive,
          })}
        >
          {mapList
            .filter((map) => map.id)
            .map((map) => (
              <div
                key={map.id}
                className={classNames('im-mapselect-base-dropdown-item', {
                  active: map.name === activeMap.name,
                })}
                onClick={() => handleMapChange(map.id)}
              >
                <span>{map.name}</span>
              </div>
            ))}
        </div>
      </div>
      {activeMap.layers && (
        <div className="im-mapselect-layer">
          <div className="im-mapselect-layer-surface" onClick={handleLayerSelect}>
            <span>{activeLayer || '表层'}</span>
            <span className="im-mapselect-base-surface-arrow">
              {layerSelectActive ? (
                <Icon type="icon-arrow-drop-up-fill" />
              ) : (
                <Icon type="icon-arrow-drop-down-fill" />
              )}
            </span>
          </div>
          <div
            className={classNames('im-mapselect-layer-dropdown', {
              active: layerSelectActive,
            })}
          >
            <div
              className={classNames('im-mapselect-layer-dropdown-item', {
                active: !activeLayer,
              })}
              onClick={() => handleLayerChange('')}
            >
              <span>表层</span>
            </div>
            {activeMap.layers.map((layer) => (
              <div
                key={layer.name}
                className={classNames('im-mapselect-layer-dropdown-item', {
                  active: layer.name === activeLayer,
                })}
                onClick={() => handleLayerChange(layer.name)}
              >
                <span>{layer.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
