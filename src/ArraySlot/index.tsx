import * as React from 'react';
import { useSlotPlugs } from '../shared/useSlotPlugs';
import { PlugConnect } from '../shared/PlugConnect';

// Possible future features: Sorting and custom plug decoration
type Props = {
  name: string;
  slotProps?: object;
};

export function ArraySlot({ name, slotProps = {} }: Props) {
  const plugs = useSlotPlugs(name);
  return (
    // TS isn't happy with function components returning non-JSX.Elements
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    <>
      {plugs.map(plug => (
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
