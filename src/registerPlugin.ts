import { IPluginDef, registerPlugin as registerUiPlugin } from 'ui-plugin';
import { addPlug } from './pluginStore';
import { IRenderableWithProps } from './shared';

export interface IPlugDef<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> extends IRenderableWithProps<PluginConfig, PluginState, ComponentProps> {
  slotName: string;
}

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const api = registerUiPlugin(pluginDef);

  function plug<ComponentProps extends object>({
    slotName,
    render,
    getProps,
  }: IPlugDef<PluginConfig, PluginState, ComponentProps>) {
    addPlug(slotName, { pluginName: pluginDef.name, render, getProps });
  }

  return { ...api, plug };
}
