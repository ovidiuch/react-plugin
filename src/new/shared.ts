import { IPluginContext } from 'ui-plugin';

export type Renderable<ComponentProps> =
  | React.ComponentType<ComponentProps>
  | React.ReactElement<any>
  | string;

export type GetProps<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> = (
  context: IPluginContext<PluginConfig, PluginState>,
  slotProps: { [key: string]: any },
) => ComponentProps;

export interface IPlug<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> {
  pluginName: string;
  render: Renderable<ComponentProps>;
  getProps?: GetProps<PluginConfig, PluginState, ComponentProps>;
}

export interface IPlugs {
  [slotName: string]: Array<IPlug<any, any, any>>;
}
