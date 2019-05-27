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
  const [plugProps, setPlugProps] = React.useState(
    // Avoid getting plugin context after initial PlugConnect state is created
    () => getPlugProps(pluginName, slotProps),
  );

  const updatePlugProps = React.useCallback(() => {
    // This check covers a scenario that can't be tested easily. It occurs in
    // async React, but not with react-test-renderer. When  rendering is async,
    // it takes a while for the Slot components to process plugin changes, so
    // PlugConnect components might receive state changes for plugins that are
    // no longer enabled.
    if (getPlugin(pluginName).enabled) {
      setPlugProps(getPlugProps(pluginName, slotProps));
    }
  }, [pluginName, slotProps]);

  React.useEffect(() => {
    // Plugin state might've changed since the component rendered
    updatePlugProps();
    return onStateChange(updatePlugProps);
  }, [updatePlugProps]);

  return React.createElement(component, plugProps, children);
}

function getPlugProps(pluginName: string, slotProps: object) {
  return { pluginContext: getPluginContext(pluginName), slotProps };
}
