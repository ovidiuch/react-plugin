import { isEqual } from 'lodash';
import * as React from 'react';
import { onPluginLoad } from 'ui-plugin';
import { getEnabledSlotPlugs } from '../store';

export function useSlotPlugs(slotName: string) {
  const [plugs, setPlugs] = React.useState(() => getEnabledSlotPlugs(slotName));

  // Keep plugs in sync with slotName
  const lastSlotName = React.useRef(slotName);
  React.useEffect(() => {
    // Prevent setting plugs to state twice on mount
    if (slotName !== lastSlotName.current) {
      setPlugs(getEnabledSlotPlugs(slotName));
      lastSlotName.current = slotName;
    }
  }, [slotName]);

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
