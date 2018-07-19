import { func } from 'prop-types';
import { Component } from 'react';
import { getPlugins, enablePlugin, disablePlugin } from './store';

export class Consumer extends Component {
  state = {
    plugins: getPlugins()
  };

  static propTypes = {
    children: func.isRequired
  };

  createEnableHandler = pluginId => () => {
    enablePlugin(pluginId);
    this.updatePlugins();
  };

  createDisableHandler = pluginId => () => {
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
        disable: this.createDisableHandler(plugin.id)
      }))
    });
  }

  updatePlugins() {
    this.setState({
      plugins: getPlugins()
    });
  }
}
