import { getPluginApi as getVanillaPluginApi, PluginId } from 'ui-plugin';
import { registerPlug } from './pluginStore';
import { IPluginApi } from './shared';

export function getPluginApi<PluginConfig extends object, PluginState>(
  pluginId: PluginId,
): IPluginApi<PluginConfig, PluginState> {
  return {
    ...getVanillaPluginApi(pluginId),
    plug: ({ slotName, render, getProps }) => {
      registerPlug(slotName, { pluginId, render, getProps });
    },
  };
}
