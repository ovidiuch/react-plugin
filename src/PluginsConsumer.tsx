import { isEqual } from 'lodash';
import * as React from 'react';
import { enablePlugin, getPlugins, IPlugin, onPluginChange } from 'ui-plugin';

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

  removePluginChangeHandler: null | (() => unknown) = null;

  render() {
    const { children } = this.props;
    const { plugins } = this.state;

    return children({
      plugins,
      enable: this.handleEnable,
    });
  }

  componentDidMount() {
    this.removePluginChangeHandler = onPluginChange(this.handlePluginChange);
  }

  componentWillUnmount() {
    if (this.removePluginChangeHandler) {
      this.removePluginChangeHandler();
      this.removePluginChangeHandler = null;
    }
  }

  handlePluginChange = () => {
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
