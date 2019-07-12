import {
  createPlugin as createUPlugin,
  PluginSpec,
  PluginCreateArgs,
  PluginCreateApi,
} from 'ui-plugin';
import { PlugComponentType } from './shared/types';
import { registerPlug } from './store';

interface ReactPluginCreateApi<Spec extends PluginSpec> extends PluginCreateApi<Spec> {
  plug<SlotProps extends {} = {}>(
    slotName: string,
    component: PlugComponentType<Spec, SlotProps>,
  ): void;
  namedPlug<SlotProps extends {} = {}>(
    slotName: string,
    plugName: string,
    component: PlugComponentType<Spec, SlotProps>,
  ): void;
}

export function createPlugin<Spec extends PluginSpec>(
  args: PluginCreateArgs<Spec>,
): ReactPluginCreateApi<Spec> {
  const plugin = createUPlugin<Spec>(args);
  const plugs: Array<{
    slotName: string;
    component: PlugComponentType<Spec, any>;
    plugName?: string;
  }> = [];

  return {
    ...plugin,

    plug: (slotName, component) => {
      plugs.push({ slotName, component });
    },

    namedPlug: (slotName, plugName, component) => {
      plugs.push({ slotName, component, plugName });
    },

    register: () => {
      plugin.register();
      plugs.forEach(({ slotName, component, plugName }) => {
        registerPlug({ slotName, pluginName: args.name, component, plugName });
      });
    },
  };
}
