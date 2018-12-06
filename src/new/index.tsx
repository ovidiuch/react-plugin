import * as React from 'react';
import {
  IPluginDef,
  mountPlugins as mountUiPlugins,
  registerPlugin as registerUiPlugin,
} from 'ui-plugin';
import { addPlug } from './pluginStore';
import { GetPropsHandler, IReactPluginMountOpts } from './shared';
import { Slot } from './Slot';

export { resetPlugins } from './pluginStore';
export { Slot } from './Slot';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const api = registerUiPlugin(pluginDef);
  const { onState } = api;

  function plug<ComponentProps extends object>({
    slotName,
    component,
    getProps,
  }: {
    slotName: string;
    component: React.ComponentType<ComponentProps>;
    getProps?: GetPropsHandler<PluginConfig, PluginState, ComponentProps>;
  }) {
    addPlug({ slotName, component, getProps });

    onState(context => {
      // TODO: Trigger slots with {slotName} to re-render with props
    });
  }

  return { ...api, plug };
}

export function mountPlugins({
  rootSlotName = 'root',
  ...otherOpts
}: IReactPluginMountOpts = {}) {
  mountUiPlugins(otherOpts);

  return {
    rootElement: <Slot name={rootSlotName} />,
  };
}
