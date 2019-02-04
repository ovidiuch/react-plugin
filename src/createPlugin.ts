import {
  createPlugin as createUiPlugin,
  IPluginSpec,
  PluginCreateArgs,
  IPluginCreateApi as IUiPluginCreateApi,
} from 'ui-plugin';
import { IPlugArgs } from './types';
import { registerPlug } from './store';

interface IPluginCreateApi<PluginSpec extends IPluginSpec> extends IUiPluginCreateApi<PluginSpec> {
  plug: <ComponentProps extends object>(plugArgs: IPlugArgs<PluginSpec, ComponentProps>) => void;
}

export function createPlugin<PluginSpec extends IPluginSpec>(
  args: PluginCreateArgs<PluginSpec>,
): IPluginCreateApi<PluginSpec> {
  const plugin = createUiPlugin<PluginSpec>(args);
  const plugs: Array<IPlugArgs<PluginSpec, any>> = [];

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
