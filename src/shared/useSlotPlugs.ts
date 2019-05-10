import { isEqual } from 'lodash';
import * as React from 'react';
import { onPluginLoad } from 'ui-plugin';
import { getEnabledSlotPlugs } from '../store';

export function useSlotPlugs(slotName: string) {
  const [plugs, setPlugs] = React.useState(getEnabledSlotPlugs(slotName));
  React.useEffect(
    () =>
      onPluginLoad(() => {
        const newPlugs = getEnabledSlotPlugs(slotName);
        if (!isEqual(newPlugs, plugs)) {
          setPlugs(newPlugs);
        }
      }),
    [plugs, slotName],
  );
  return plugs;
}
