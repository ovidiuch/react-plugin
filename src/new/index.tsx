import { IPluginDef, registerPlugin as registerUiPlugin } from 'ui-plugin';
import { addPlug } from './pluginStore';
import { GetProps, Renderable } from './shared';

export { mountPlugins } from 'ui-plugin';
export { resetPlugins } from './pluginStore';
export { Slot } from './Slot';

interface ISlotDef<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> {
  slotName: string;
  render: Renderable<ComponentProps>;
  getProps?: GetProps<PluginConfig, PluginState, ComponentProps>;
}

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const api = registerUiPlugin(pluginDef);

  function plug<ComponentProps extends object>({
    slotName,
    render,
    getProps,
  }: ISlotDef<PluginConfig, PluginState, ComponentProps>) {
    addPlug(slotName, { pluginName: pluginDef.name, render, getProps });
  }

  return { ...api, plug };
}
