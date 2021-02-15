import { ComponentType, ReactNode } from 'react';
import { PluginContext, PluginSpec } from 'ui-plugin';

export type PlugProps<TSpec extends PluginSpec, TSlotProps extends {}> = {
  children?: ReactNode;
  pluginContext: PluginContext<TSpec>;
  slotProps: TSlotProps;
};

export type PlugComponentType<
  TSpec extends PluginSpec,
  TSlotProps extends {}
> = ComponentType<PlugProps<TSpec, TSlotProps>>;

export type Plug<T extends PluginSpec = any> = {
  id: number;
  pluginName: T['name'];
  component: PlugComponentType<any, any>;
  plugName?: string;
};

export type Plugs = { [slotName: string]: Plug[] };
