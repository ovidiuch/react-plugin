import {
  createPlugin as createUiPlugin,
  PluginArgs,
  PluginCreateApi,
  PluginSpec,
} from 'ui-plugin';
import { registerPlug } from './pluginStore';
import { PlugComponentType } from './types';

interface CreateApi<T extends PluginSpec> extends PluginCreateApi<T> {
  plug<SlotProps extends {}>(
    slotName: string,
    component: PlugComponentType<T, SlotProps>,
  ): void;
  namedPlug<SlotProps extends {}>(
    slotName: string,
    plugName: string,
    component: PlugComponentType<T, SlotProps>,
  ): void;
}

type PendingPlug = {
  slotName: string;
  component: PlugComponentType<any, any>;
  plugName?: string;
};

export function createPlugin<T extends PluginSpec>(
  args: PluginArgs<T>,
): CreateApi<T> {
  const plugin = createUiPlugin(args);
  const plugs: PendingPlug[] = [];

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
