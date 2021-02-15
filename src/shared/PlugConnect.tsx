import {
  createElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getPluginContext, getPlugins, onStateChange } from 'ui-plugin';
import { PlugComponentType } from './types';

type Props = {
  children?: ReactNode;
  component: PlugComponentType<any, any>;
  pluginName: string;
  slotProps: object;
};

export function PlugConnect({
  children,
  component,
  pluginName,
  slotProps,
}: Props) {
  const [plugProps, setPlugProps] = useState(
    // Avoid getting plugin context after initial PlugConnect state is created
    () => getPlugProps(pluginName, slotProps),
  );

  const updatePlugProps = useCallback(() => {
    // This check covers a scenario that can't be tested easily. It occurs in
    // async React, but not with react-test-renderer. When rendering is async,
    // it takes a while for the Slot components to process plugin changes, so
    // PlugConnect components might receive state changes for plugins that are
    // no longer enabled.
    const plugins = getPlugins();
    if (plugins[pluginName] && plugins[pluginName].enabled)
      setPlugProps(getPlugProps(pluginName, slotProps));
  }, [pluginName, slotProps]);

  useEffect(() => {
    // Plugin state might've changed since the component rendered
    updatePlugProps();
    return onStateChange(updatePlugProps);
  }, [updatePlugProps]);

  return createElement(component, plugProps, children);
}

function getPlugProps(pluginName: string, slotProps: object) {
  return { pluginContext: getPluginContext(pluginName), slotProps };
}
