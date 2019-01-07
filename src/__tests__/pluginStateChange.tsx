import retry from '@skidding/async-retry';
import * as React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

function HelloMessage({ name }: { name: string }) {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>Hello ${name}!</>;
}

it('updates plug props on state change', async () => {
  const { plug, init } = registerPlugin({
    name: 'test',
    initialState: 'Sarah',
  });

  plug({
    slotName: 'root',
    render: HelloMessage,
    getProps: ({ getState }) => ({ name: getState() }),
  });

  init(({ setState }) => {
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
