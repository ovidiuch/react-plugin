import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { onPluginLoad } from 'ui-plugin';
import { getEnabledSlotPlugs } from '../store';

export function useSlotPlugs(slotName: string) {
  const [plugs, setPlugs] = useState(() => getEnabledSlotPlugs(slotName));

  // Keep plugs in sync with slotName
  const lastSlotName = useRef(slotName);
  useEffect(() => {
    // Prevent setting plugs to state twice on mount
    if (slotName !== lastSlotName.current) {
      setPlugs(getEnabledSlotPlugs(slotName));
      lastSlotName.current = slotName;
    }
  }, [slotName]);

  useEffect(
    () =>
      onPluginLoad(() => {
        const newPlugs = getEnabledSlotPlugs(slotName);
        if (!isEqual(newPlugs, plugs)) setPlugs(newPlugs);
      }),
    [plugs, slotName],
  );
  return plugs;
}
