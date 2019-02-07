import retry from '@skidding/async-retry';
import * as React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { createPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

function HelloMessage({ name }: { name: string }) {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>Hello ${name}!</>;
}

interface Test {
  name: 'test';
  state: string;
}

it('updates plug props on state change', async () => {
  const { plug, onLoad, register } = createPlugin<Test>({
    name: 'test',
    initialState: 'Sarah',
  });
  plug({
    slotName: 'root',
    render: HelloMessage,
    getProps: ({ getState }) => ({ name: getState() }),
  });
  register();

  onLoad(({ setState }) => {
    setTimeout(() => {
      setState('Sarah D.');
    });
  });

  loadPlugins();
  const renderer = create(<Slot name="root" />);

  await retry(() =>
    // expect().toMatchInlineSnapshot can't be placed inside async retry()
    expect(getRendereredName(renderer)).toEqual('Sarah D.'),
  );
});

function getRendereredName(renderer: ReactTestRenderer) {
  return renderer.root.findByType(HelloMessage).props.name;
}
