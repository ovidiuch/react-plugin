import React from 'react';
import { PlugConnect } from '../shared/PlugConnect';
import { Plug } from '../shared/types';
import { useSlotPlugs } from '../shared/useSlotPlugs';

type Props = {
  name: string;
  slotProps?: object;
  plugOrder?: string[];
};

export function ArraySlot({ name, slotProps = {}, plugOrder = [] }: Props) {
  const plugs = useSlotPlugs(name);
  return (
    // TS isn't happy with function components returning non-JSX.Elements
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    <>
      {getSortedPlugs(plugs, plugOrder).map(plug => (
        <PlugConnect
          key={plug.id}
          pluginName={plug.pluginName}
          component={plug.component}
          slotProps={slotProps}
        />
      ))}
    </>
  );
}

function getSortedPlugs(plugs: Plug<any>[], plugOrder: string[]) {
  const orderedPlugs = plugs
    .filter(
      p =>
        typeof p.plugName === 'string' && plugOrder.indexOf(p.plugName) !== -1,
    )
    .sort(
      (p1, p2) =>
        plugOrder.indexOf(p1.plugName!) - plugOrder.indexOf(p2.plugName!),
    );
  const unorderedPlugs = plugs.filter(p => orderedPlugs.indexOf(p) === -1);
  return [...orderedPlugs, ...unorderedPlugs];
}
