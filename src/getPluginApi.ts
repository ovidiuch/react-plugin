import { getPluginApi as getVanillaPluginApi } from 'ui-plugin';
import { registerPlug } from './pluginStore';
import { IPluginApi } from './shared';

export function getPluginApi<PluginConfig extends object, PluginState>(
  pluginName: string,
): IPluginApi<PluginConfig, PluginState> {
  return {
    ...getVanillaPluginApi(pluginName),
    plug: ({ slotName, render, getProps }) => {
      registerPlug(slotName, { pluginName, render, getProps });
    },
  };
}
