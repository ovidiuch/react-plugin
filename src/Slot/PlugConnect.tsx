import { isEqual } from 'lodash';
import * as React from 'react';
import { getPluginContext, onStateChange } from 'ui-plugin';
import { GetProps } from '../shared';

interface IProps {
  pluginName: string;
  component: React.ComponentType;
  slotProps: object;
  getProps: GetProps;
  children?: React.ReactNode;
}

interface IState {
  plugProps: object;
}

export class PlugConnect extends React.Component<IProps, IState> {
  state = {
    plugProps: this.getPlugProps(),
  };

  removeStateChangeHandler: null | (() => unknown) = null;

  render() {
    const { component, children } = this.props;
    const { plugProps } = this.state;

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
    const newProps = this.getPlugProps();

    // NOTE: This can be optimized. We can avoid running plug.getProps when
    // relevant state hasn't changed.
    // TODO: What about annonymous "dispatch" function props?
    if (!isEqual(newProps, this.state.plugProps)) {
      this.setState({ plugProps: newProps });
    }
  };

  getPlugProps() {
    const { pluginName, slotProps, getProps } = this.props;

    return getProps(getPluginContext(pluginName), slotProps);
  }
}
