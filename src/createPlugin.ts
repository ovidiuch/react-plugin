import {
  createPlugin as createUiPlugin,
  PluginArgs,
  PluginCreateApi,
  PluginSpec,
} from 'ui-plugin';
import { PlugComponentType } from './shared/types';
import { registerPlug } from './pluginStore';

interface ReactPluginCreateApi<T extends PluginSpec>
  extends PluginCreateApi<T> {
  plug<SlotProps extends {} = {}>(
    slotName: string,
    component: PlugComponentType<T, SlotProps>,
  ): void;
  namedPlug<SlotProps extends {} = {}>(
    slotName: string,
    plugName: string,
    component: PlugComponentType<T, SlotProps>,
  ): void;
}

export function createPlugin<T extends PluginSpec>(
  args: PluginArgs<T>,
): ReactPluginCreateApi<T> {
  const plugin = createUiPlugin<T>(args);
  const plugs: {
    slotName: string;
    component: PlugComponentType<T, any>;
    plugName?: string;
  }[] = [];

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
