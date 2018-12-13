import { IPluginApi as IVanillaPluginApi, IPluginContext } from 'ui-plugin';

export type Renderable<ComponentProps> =
  | React.ComponentType<ComponentProps>
  | React.ReactElement<any>
  | string;

export interface IRenderableWithProps<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> {
  render: Renderable<ComponentProps & { children: React.ReactNode }>;
  getProps?: GetProps<PluginConfig, PluginState, ComponentProps>;
}

export type GetProps<
  PluginConfig extends object = any,
  PluginState = any,
  ComponentProps extends object = any
> = (
  context: IPluginContext<PluginConfig, PluginState>,
  slotProps: { [key: string]: any },
) => ComponentProps;

export interface IPlugDef<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> extends IRenderableWithProps<PluginConfig, PluginState, ComponentProps> {
  slotName: string;
}

export interface IPluginApi<PluginConfig extends object, PluginState>
  extends IVanillaPluginApi<PluginConfig, PluginState> {
  plug: <ComponentProps extends object>(
    plugDef: IPlugDef<PluginConfig, PluginState, ComponentProps>,
  ) => void;
}

export interface IPlug<
  PluginConfig extends object = any,
  PluginState = any,
  ComponentProps extends object = any
> extends IRenderableWithProps<PluginConfig, PluginState, ComponentProps> {
  pluginName: string;
}

export interface IPlugs {
  [slotName: string]: IPlug[];
}
