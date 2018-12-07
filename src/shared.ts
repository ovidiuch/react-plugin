import { IPluginContext } from 'ui-plugin';

export type Renderable<ComponentProps> =
  | React.ComponentType<ComponentProps>
  | React.ReactElement<any>
  | string;

export type GetProps<
  PluginConfig extends object = any,
  PluginState = any,
  ComponentProps extends object = any
> = (
  context: IPluginContext<PluginConfig, PluginState>,
  slotProps: { [key: string]: any },
) => ComponentProps;

export interface IPlug<
  PluginConfig extends object = any,
  PluginState = any,
  ComponentProps extends object = any
> {
  pluginName: string;
  render: Renderable<ComponentProps>;
  getProps?: GetProps<PluginConfig, PluginState, ComponentProps>;
}

export interface IPlugs {
  [slotName: string]: IPlug[];
}
