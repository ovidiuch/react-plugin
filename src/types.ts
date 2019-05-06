import { PluginSpec, PluginContext } from 'ui-plugin';

type RenderableWithProps<Spec extends PluginSpec, Props extends object> = {
  render: React.ComponentType<Props & { children?: React.ReactNode }>;
  getProps?: GetProps<Spec, Props>;
};

export type GetProps<Spec extends PluginSpec = any, Props extends object = any> = (
  context: PluginContext<Spec>,
  slotProps: { [key: string]: any },
) => Props;

export type PlugArgs<
  Spec extends PluginSpec,
  Props extends object
> = RenderableWithProps<Spec, Props> & {
  slotName: string;
};

export type Plug<
  Spec extends PluginSpec = any,
  Props extends object = any
> = RenderableWithProps<Spec, Props> & {
  pluginName: Spec['name'];
};

export type Plugs = { [slotName: string]: Plug[] };
