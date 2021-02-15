import { ComponentType, ReactNode } from 'react';
import { PluginContext, PluginSpec } from 'ui-plugin';

export type PlugProps<Spec extends PluginSpec, SlotProps extends {}> = {
  children?: ReactNode;
  pluginContext: PluginContext<Spec>;
  slotProps: SlotProps;
};

export type PlugComponentType<
  Spec extends PluginSpec,
  SlotProps extends {}
> = ComponentType<PlugProps<Spec, SlotProps>>;

export type Plug<Spec extends PluginSpec = any> = {
  id: number;
  pluginName: Spec['name'];
  component: PlugComponentType<any, any>;
  plugName?: string;
};

export type Plugs = { [slotName: string]: Plug[] };
