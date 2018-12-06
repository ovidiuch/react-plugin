import { IPluginContext } from 'ui-plugin';

export type Renderable<ComponentProps> =
  | React.ComponentType<ComponentProps>
  | React.ReactNode;

export interface ISlotPlug<ComponentProps extends object = any> {
  slotName: string;
  render: Renderable<ComponentProps>;
  getProps?: GetPropsHandler<any, any, any>;
}

export interface ISlots {
  [slotName: string]: ISlotPlug[];
}

export type GetPropsHandler<
  PluginConfig extends object,
  PluginState,
  ComponentProps extends object
> = (
  context: IPluginContext<PluginConfig, PluginState>,
  slotProps: object,
) => ComponentProps;
