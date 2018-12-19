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

function register(name: string) {
  const { plug } = registerPlugin({ name: 'test', initialState: 'Sara' });
  plug({
    slotName: 'root',
    render: HelloMessage,
    getProps: () => ({ name }),
  });
}

it('updates plug props on plugin change', async () => {
  register('Sara');

  loadPlugins();
  const renderer = create(<Slot name="root" />);

  register('Sarah');

  await retry(() =>
    // expect().toMatchInlineSnapshot can't be placed inside async retry()
    expect(getRendereredName(renderer)).toEqual('Sarah'),
  );
});

function getRendereredName(renderer: ReactTestRenderer) {
  return renderer.root.findByType(HelloMessage).props.name;
}
