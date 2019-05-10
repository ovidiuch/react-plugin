import * as React from 'react';
import { isEqual } from 'lodash';
import { enablePlugin, getPlugins, Plugin, onPluginLoad } from 'ui-plugin';

type Props = {
  children: (props: {
    plugins: Plugin[];
    enable: (pluginName: string, enabled: boolean) => void;
  }) => React.ReactNode;
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
  const [plugins, setPlugins] = React.useState(getPluginArray());
  React.useEffect(
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
