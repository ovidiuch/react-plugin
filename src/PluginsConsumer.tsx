import * as React from 'react';
import {
  disablePlugin,
  enablePlugin,
  getPlugins,
  IPlugin,
  PluginId,
} from './store';

interface IProps {
  children: (
    args: {
      plugins: Array<IPlugin & { enable: () => void; disable: () => void }>;
    },
  ) => React.ReactNode;
}

interface IState {
  plugins: IPlugin[];
}

export class PluginsConsumer extends React.Component<IProps, IState> {
  state = {
    plugins: getPlugins(),
  };

  createEnableHandler = (pluginId: PluginId) => () => {
    enablePlugin(pluginId);
    this.updatePlugins();
  };

  createDisableHandler = (pluginId: PluginId) => () => {
    disablePlugin(pluginId);
    this.updatePlugins();
  };

  render() {
    const { children } = this.props;
    const { plugins } = this.state;

    return children({
      plugins: plugins.map(plugin => ({
        ...plugin,
        enable: this.createEnableHandler(plugin.id),
        disable: this.createDisableHandler(plugin.id),
      })),
    });
  }

  updatePlugins() {
    this.setState({
      plugins: getPlugins(),
    });
  }
}
