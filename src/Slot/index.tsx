import createLinkedList from '@skidding/linked-list';
import { isEqual } from 'lodash';
import * as React from 'react';
import { isValidElementType } from 'react-is';
import { onPluginChange } from 'ui-plugin';
import { getPlugs } from '../pluginStore';
import { IPlug } from '../shared';
import { getSlotContext } from './contexts';
import { PlugConnect } from './PlugConnect';

interface IProps {
  name: string;
  children?: React.ReactNode;
  props?: object;
}

interface IState {
  plugs: IPlug[];
}

export class Slot extends React.Component<IProps, IState> {
  state = {
    plugs: getPlugs(this.props.name),
  };

  removePluginChangeHandler: null | (() => unknown) = null;

  render() {
    const { name, children, props = {} } = this.props;
    const { plugs } = this.state;
    const { Provider, Consumer } = getSlotContext(name);

    if (!plugs) {
      // No plugs are registered for this slot in this render-cycle. Plugs
      // for this slot may be registered later.
      return null;
    }

    // Children are either
    // - passed to the next plug or,
    // - if this is the last plug for this slot, rendered directly.
    return (
      <Consumer>
        {(linkedSlotItem = getFirstLinkedPlug(plugs)) => {
          const { value: plug, next } = linkedSlotItem;

          // All registered plugs for this slot have been rendered (for
          // now). More plugs for this slot can be registered later, which
          // will re-render all plugs from scratch.
          if (!plug) {
            return children;
          }

          return (
            <Provider value={next()}>
              {getPlugNode(plug, props, children)}
            </Provider>
          );
        }}
      </Consumer>
    );
  }

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return !isEqual(nextState.plugs, this.state.plugs);
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
    this.setState({ plugs: getPlugs(this.props.name) });
  };
}

function getPlugNode(
  plug: IPlug,
  slotProps: object,
  children?: React.ReactNode,
) {
  const { pluginName, render, getProps } = plug;

  if (typeof render === 'string' || !isValidElementType(render)) {
    return render;
  }

  if (typeof getProps === 'function') {
    return (
      <PlugConnect
        pluginName={pluginName}
        component={render}
        slotProps={slotProps}
        getProps={getProps}
      >
        {children}
      </PlugConnect>
    );
  }

  return React.createElement(render, slotProps, children);
}

function getFirstLinkedPlug(plugs: IPlug[]) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
