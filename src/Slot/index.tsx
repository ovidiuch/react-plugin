import createLinkedList from '@skidding/linked-list';
import { isEqual } from 'lodash';
import * as React from 'react';
import { onPluginLoad } from 'ui-plugin';
import { Plug } from '../types';
import { getEnabledPlugsForSlot } from '../store';
import { getSlotContext } from './contexts';
import { PlugConnect } from './PlugConnect';

type Props = {
  name: string;
  children?: React.ReactNode;
  props?: object;
};

type State = {
  plugs: Plug[];
};

export class Slot extends React.Component<Props, State> {
  state = {
    plugs: getEnabledPlugsForSlot(this.props.name),
  };

  removePluginLoadHandler: null | (() => unknown) = null;

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
            <Provider value={next()}>{getPlugNode(plug, props, children)}</Provider>
          );
        }}
      </Consumer>
    );
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
    const newPlugs = getEnabledPlugsForSlot(this.props.name);
    if (!isEqual(newPlugs, this.state.plugs)) {
      this.setState({ plugs: newPlugs });
    }
  };
}

function getPlugNode(plug: Plug, slotProps: object, children?: React.ReactNode) {
  const { pluginName, component } = plug;
  return (
    <PlugConnect pluginName={pluginName} component={component} slotProps={slotProps}>
      {children}
    </PlugConnect>
  );
}

function getFirstLinkedPlug(plugs: Plug[]) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
