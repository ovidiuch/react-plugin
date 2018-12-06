import { IPluginContext, IPluginMountOpts } from 'ui-plugin';

export interface ISlotPlug {
  slotName: string;
  component: React.ComponentType<any>;
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

export interface IReactPluginMountOpts extends IPluginMountOpts {
  rootSlotName?: string;
}
