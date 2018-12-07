import { IPluginDef, registerPlugin as registerUiPlugin } from 'ui-plugin';
import { addPlug } from './pluginStore';
import { GetProps, Renderable } from './shared';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const api = registerUiPlugin(pluginDef);

  function plug<ComponentProps extends object>({
    slotName,
    render,
    getProps,
  }: {
    slotName: string;
    render: Renderable<ComponentProps>;
    getProps?: GetProps<PluginConfig, PluginState, ComponentProps>;
  }) {
    addPlug(slotName, { pluginName: pluginDef.name, render, getProps });
  }

  return { ...api, plug };
}
