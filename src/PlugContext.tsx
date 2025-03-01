import { createContext, useContext } from 'react';
import { PluginSpec } from 'ui-plugin';
import { PlugContextValue } from './types';

export const PlugContext =
  createContext<PlugContextValue<PluginSpec, {}>>(null);

export function usePlugContext<
  TSpec extends PluginSpec,
  TSlotProps extends {},
>() {
  const value = useContext(PlugContext);
  if (!value) throw new Error('Plug context missing');
  return value as PlugContextValue<TSpec, TSlotProps>;
}
