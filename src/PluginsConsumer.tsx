import { isEqual } from 'lodash';
import * as React from 'react';
import { enablePlugin, getPlugins, IPlugin, onPluginLoad } from 'ui-plugin';

interface IProps {
  children: (
    props: {
      plugins: IPlugin[];
      enable: (pluginName: string, enabled: boolean) => void;
    },
  ) => React.ReactNode;
}

interface IState {
  plugins: IPlugin[];
}

export class PluginsConsumer extends React.Component<IProps, IState> {
  state = {
    plugins: getPluginArray(),
  };

  removePluginLoadHandler: null | (() => unknown) = null;

  render() {
    const { children } = this.props;
    const { plugins } = this.state;

    return children({
      plugins,
      enable: this.handleEnable,
    });
  }

  componentDidMount() {
    this.removePluginLoadHandler = onPluginLoad(this.handlePluginLoad);
  }

  componentWillUnmount() {
    if (this.removePluginLoadHandler) {
      this.removePluginLoadHandler();
      this.removePluginLoadHandler = null;
    }
  }

  handlePluginLoad = () => {
    const newPlugins = getPluginArray();

    if (!isEqual(newPlugins, this.state.plugins)) {
      this.setState({ plugins: newPlugins });
    }
  };

  handleEnable = (pluginName: string, enabled: boolean) => {
    enablePlugin(pluginName, enabled);
  };
}

function getPluginArray() {
  const allPlugins = getPlugins();

  return Object.keys(allPlugins).map(pluginName => allPlugins[pluginName]);
}
