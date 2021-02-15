import { isEqual } from 'lodash';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  enablePlugin,
  getPlugins,
  onPluginLoad,
  PluginRecord,
} from 'ui-plugin';

type Props = {
  children: (props: {
    plugins: PluginRecord[];
    enable: (pluginName: string, enabled: boolean) => void;
  }) => ReactNode;
};

export function PluginsConsumer({ children }: Props) {
  const plugins = usePlugins();
  return (
    // TS isn't happy with function components returning non-JSX.Elements
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    <>
      {children({
        plugins,
        enable: (pluginName: string, enabled: boolean) => {
          enablePlugin(pluginName, enabled);
        },
      })}
    </>
  );
}

function usePlugins() {
  const [plugins, setPlugins] = useState(getPluginArray());
  useEffect(
    () =>
      onPluginLoad(() => {
        const newPlugins = getPluginArray();
        if (!isEqual(newPlugins, plugins)) {
          setPlugins(newPlugins);
        }
      }),
    [plugins],
  );
  return plugins;
}

function getPluginArray() {
  const allPlugins = getPlugins();
  return Object.keys(allPlugins).map(pluginName => allPlugins[pluginName]);
}
