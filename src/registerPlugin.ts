import { createPlugin, IPluginDef } from 'ui-plugin';
import { getPluginApi } from './getPluginApi';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const plugin = createPlugin(pluginDef);

  return getPluginApi<PluginConfig, PluginState>(plugin.id);
}
