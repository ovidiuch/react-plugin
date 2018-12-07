import * as React from 'react';
import { enablePlugin, getPlugins, IPlugin, reloadPlugins } from 'ui-plugin';

interface IProps {
  children: (
    plugins: Array<{
      name: string;
      plugin: IPlugin;
      enable: () => void;
      disable: () => void;
    }>,
  ) => React.ReactNode;
}

export class PluginsConsumer extends React.Component<IProps> {
  createEnableHandler = (pluginName: string) => () => {
    enablePlugin(pluginName, true);
    reloadPlugins();
  };

  createDisableHandler = (pluginName: string) => () => {
    enablePlugin(pluginName, false);
    reloadPlugins();
  };

  render() {
    const plugins = getPlugins();
    const pluginNames = Object.keys(plugins);

    return this.props.children(
      pluginNames.map(pluginName => ({
        name: pluginName,
        plugin: plugins[pluginName],
        enable: this.createEnableHandler(pluginName),
        disable: this.createDisableHandler(pluginName),
      })),
    );
  }
}
