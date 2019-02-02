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

  return {
    ...plugin,

    plug: ({ slotName, render, getProps }) => {
      registerPlug(slotName, {
        pluginName: args.name,
        render,
        getProps,
      });
    },
  };
}
