import { isEqual } from 'lodash';
import * as React from 'react';
import {
  addStateHandler,
  getPluginContext,
  removeStateHandler,
} from 'ui-plugin';
import { GetProps } from './shared';

interface IProps {
  pluginName: string;
  component: React.ComponentType;
  slotProps: object;
  getProps: GetProps;
  children?: React.ReactNode;
}

export class PlugConnect extends React.Component<IProps, object> {
  state = this.getPlugProps();

  render() {
    const { component, children } = this.props;

    return React.createElement(component, this.state, children);
  }

  componentDidMount() {
    addStateHandler({
      pluginName: this.props.pluginName,
      handler: this.handleStateChange,
    });
  }

  componentWillUnmount() {
    removeStateHandler({
      pluginName: this.props.pluginName,
      handler: this.handleStateChange,
    });
  }

  handleStateChange = () => {
    const newProps = this.getPlugProps();

    // NOTE: This can be optimized. We can avoid running plug.getProps when
    // relevant state hasn't changed.
    if (!isEqual(newProps, this.state)) {
      this.setState(newProps);
    }
  };

  getPlugProps() {
    const { pluginName, slotProps, getProps } = this.props;

    return getProps(getPluginContext(pluginName), slotProps);
  }
}
