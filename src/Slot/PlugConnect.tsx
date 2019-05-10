import * as React from 'react';
import { getPlugin, getPluginContext, onStateChange } from 'ui-plugin';
import { PlugComponentType } from '../types';

type Props = {
  pluginName: string;
  component: PlugComponentType<any, any>;
  slotProps: object;
  children?: React.ReactNode;
};

export class PlugConnect extends React.Component<Props> {
  removeStateChangeHandler: null | (() => unknown) = null;

  render() {
    const { component, children } = this.props;
    const plugProps = this.getPlugProps();

    return React.createElement(component, plugProps, children);
  }

  componentDidMount() {
    this.removeStateChangeHandler = onStateChange(this.handleStateChange);
  }

  componentWillUnmount() {
    if (this.removeStateChangeHandler) {
      this.removeStateChangeHandler();
      this.removeStateChangeHandler = null;
    }
  }

  handleStateChange = () => {
    // This check covers a scenario that can't be tested easily. It occurs when
    // the React renderer is async and Slot's componentWillUnmount is called
    // asynchronously, which is not the case with react-test-renderer. When
    // rendering is async, it takes a while for the Slot components to process
    // plugin changes, so PlugConnect components might receive state changes
    // for plugins that are no longer enabled.
    if (getPlugin(this.props.pluginName).enabled) {
      this.forceUpdate();
    }
  };

  getPlugProps() {
    const { pluginName, slotProps = {} } = this.props;
    return { pluginContext: getPluginContext(pluginName), slotProps };
  }
}
