import * as React from 'react';
import { useSlotPlugs } from './shared/useSlotPlugs';
import { PlugConnect } from './shared/PlugConnect';

// Possible future features: Sorting and custom plug decoration
type Props = {
  name: string;
  slotProps?: object;
};

export function ArraySlot({ name, slotProps = {} }: Props) {
  // TODO: Use plug.id as element key
  return (
    // TS isn't happy with function components returning non-JSX.Elements
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    <>
      {useSlotPlugs(name).map((plug, idx) => (
        <PlugConnect
          key={idx}
          pluginName={plug.pluginName}
          component={plug.component}
          slotProps={slotProps}
        />
      ))}
    </>
  );
}
