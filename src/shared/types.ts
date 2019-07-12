import { PluginSpec, PluginContext } from 'ui-plugin';

export type PlugProps<Spec extends PluginSpec, SlotProps extends {}> = {
  children?: React.ReactNode;
  pluginContext: PluginContext<Spec>;
  slotProps: SlotProps;
};

export type PlugComponentType<
  Spec extends PluginSpec,
  SlotProps extends {}
> = React.ComponentType<PlugProps<Spec, SlotProps>>;

export type Plug<Spec extends PluginSpec = any> = {
  id: number;
  pluginName: Spec['name'];
  component: PlugComponentType<any, any>;
  plugName?: string;
};

export type Plugs = { [slotName: string]: Plug[] };
