import { IPluginDef, registerPlugin as registerVanillaPlugin } from 'ui-plugin';
import { getPluginApi } from './getPluginApi';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  registerVanillaPlugin(pluginDef);

  return getPluginApi<PluginConfig, PluginState>(pluginDef.name);
}
