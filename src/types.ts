import { IPluginSpec, IPluginContext } from 'ui-plugin';

export type Renderable<ComponentProps> =
  | React.ComponentType<ComponentProps>
  | React.ReactElement<any>
  | string;

export interface IRenderableWithProps<
  PluginSpec extends IPluginSpec,
  ComponentProps extends object
> {
  render: Renderable<ComponentProps & { children: React.ReactNode }>;
  getProps?: GetProps<PluginSpec, ComponentProps>;
}

export type GetProps<PluginSpec extends IPluginSpec = any, ComponentProps extends object = any> = (
  context: IPluginContext<PluginSpec>,
  slotProps: { [key: string]: any },
) => ComponentProps;

export interface IPlugArgs<PluginSpec extends IPluginSpec, ComponentProps extends object>
  extends IRenderableWithProps<PluginSpec, ComponentProps> {
  slotName: string;
}

export interface IPlug<PluginSpec extends IPluginSpec = any, ComponentProps extends object = any>
  extends IRenderableWithProps<PluginSpec, ComponentProps> {
  pluginName: PluginSpec['name'];
}

export interface IPlugs {
  [slotName: string]: IPlug[];
}
