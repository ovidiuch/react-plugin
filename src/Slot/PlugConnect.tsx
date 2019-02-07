import { isEqual } from 'lodash';
import * as React from 'react';
import { getPlugin, getPluginContext, onStateChange } from 'ui-plugin';
import { GetProps } from '../types';

type Props = {
  pluginName: string;
  component: React.ComponentType;
  slotProps: object;
  getProps: GetProps;
  children?: React.ReactNode;
};

type State = {
  plugProps: object;
};

export class PlugConnect extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const plugProps = getPlugProps(props);

    if (plugPropsEqual(plugProps, state.plugProps)) {
      return null;
    }

    return { plugProps };
  }

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
    // This check covers a scenario that can't be tested easily. It occurs when
    // the React renderer is async and Slot's componentWillUnmount is called
    // asynchronously, which is not the case with react-test-renderer. When
    // rendering is async, it takes a while for the Slot components to process
    // plugin changes, so PlugConnect components might receive state changes
    // for plugins that are no longer enabled.
    if (!getPlugin(this.props.pluginName).enabled) {
      return;
    }

    const newProps = this.getPlugProps();

    // NOTE: This can be optimized. We can avoid running plug.getProps when
    // relevant state hasn't changed.
    // TODO: How to avoid comparing annonymous dispatch-like functions that get
    // created on every getProps call?
    if (!plugPropsEqual(newProps, this.state.plugProps)) {
      this.setState({ plugProps: newProps });
    }
  };

  getPlugProps() {
    return getPlugProps(this.props);
  }
}

function getPlugProps({ pluginName, slotProps, getProps }: Props) {
  return getProps(getPluginContext(pluginName), slotProps);
}

function plugPropsEqual(plugProps1: object, plugProps2: object) {
  // IDEA: Assume functions with same name are equal
  return isEqual(plugProps1, plugProps2);
}
