import * as React from 'react';
import { getPlugin, getPluginContext, onStateChange } from 'ui-plugin';
import { PlugComponentType } from './types';

type Props = {
  children?: React.ReactNode;
  component: PlugComponentType<any, any>;
  pluginName: string;
  slotProps: object;
};

export function PlugConnect({ children, component, pluginName, slotProps }: Props) {
  const [lastUpdate, setLastUpdate] = React.useState(0);

  React.useEffect(
    () =>
      onStateChange(() => {
        // This check covers a scenario that can't be tested easily. It occurs when
        // the React renderer is async and Slot's componentWillUnmount is called
        // asynchronously, which is not the case with react-test-renderer. When
        // rendering is async, it takes a while for the Slot components to process
        // plugin changes, so PlugConnect components might receive state changes
        // for plugins that are no longer enabled.
        if (getPlugin(pluginName).enabled) {
          setLastUpdate(lastUpdate + 1);
        }
      }),
    [pluginName, lastUpdate],
  );

  const plugProps = { pluginContext: getPluginContext(pluginName), slotProps };
  return React.createElement(component, plugProps, children);
}