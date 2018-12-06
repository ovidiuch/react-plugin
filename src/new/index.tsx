import { IPluginDef, registerPlugin as registerUiPlugin } from 'ui-plugin';
import { addPlug } from './pluginStore';
import { ISlotPlug } from './shared';

export { resetPlugins } from './pluginStore';
export { Slot } from './Slot';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const api = registerUiPlugin(pluginDef);
  const { onState } = api;

  function plug<ComponentProps extends object>({
    slotName,
    render,
    getProps,
  }: ISlotPlug<ComponentProps>) {
    addPlug({ slotName, render, getProps });

    onState(context => {
      // TODO: Trigger slots with {slotName} to re-render with props
    });
  }

  return { ...api, plug };
}
