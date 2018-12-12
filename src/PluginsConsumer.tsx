import * as React from 'react';
import { enablePlugin, getPlugins, IPlugin } from 'ui-plugin';

interface IProps {
  children: (
    plugins: IPlugin[],
    enable: (pluginName: string, enabled: boolean) => void,
  ) => React.ReactNode;
}

export class PluginsConsumer extends React.Component<IProps> {
  handleEnable = (pluginName: string, enabled: boolean) => {
    enablePlugin(pluginName, enabled);
  };

  render() {
    const plugins = getPlugins();
    const pluginNames = Object.keys(plugins);

    return this.props.children(
      pluginNames.map(pluginName => plugins[pluginName]),
      this.handleEnable,
    );
  }
}
