import {
  createPlugin as createUPlugin,
  PluginSpec,
  PluginCreateArgs,
  PluginCreateApi,
} from 'ui-plugin';
import { PlugArgs } from './types';
import { registerPlug } from './store';

interface ReactPluginCreateApi<Spec extends PluginSpec> extends PluginCreateApi<Spec> {
  plug: <ComponentProps extends object>(
    plugArgs: PlugArgs<Spec, ComponentProps>,
  ) => void;
}

export function createPlugin<Spec extends PluginSpec>(
  args: PluginCreateArgs<Spec>,
): ReactPluginCreateApi<Spec> {
  const plugin = createUPlugin<Spec>(args);
  const plugs: Array<PlugArgs<Spec, any>> = [];

  return {
    ...plugin,

    plug: plugArgs => {
      plugs.push(plugArgs);
    },

    register: () => {
      plugin.register();
      plugs.forEach(({ slotName, render, getProps }) => {
        registerPlug(slotName, {
          pluginName: args.name,
          render,
          getProps,
        });
      });
    },
  };
}
