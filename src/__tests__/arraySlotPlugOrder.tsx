import React from 'react';
import { loadPlugins } from 'ui-plugin';
import { ArraySlot } from '../ArraySlot';
import { createPlugin } from '../createPlugin';
import { resetPlugins } from '../pluginStore';
import { createRenderer } from '../testHelpers/createRenderer';

afterEach(resetPlugins);

interface SortTest {
  name: 'test';
}

it('sorts plugs', async () => {
  const { namedPlug, register } = createPlugin<SortTest>({ name: 'test' });
  namedPlug('root', 'B', () => <>B</>);
  namedPlug('root', 'A', () => <>A</>);
  namedPlug('root', 'C', () => <>C</>);
  register();

  loadPlugins();
  const renderer = createRenderer(
    <ArraySlot name="root" plugOrder={['A', 'B', 'C']} />,
  );
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    Array [
      "A",
      "B",
      "C",
    ]
  `);
});

it('places unsorted plugs last', async () => {
  const { namedPlug, register } = createPlugin<SortTest>({ name: 'test' });
  namedPlug('root', 'B', () => <>B</>);
  namedPlug('root', 'A', () => <>A</>);
  namedPlug('root', 'C', () => <>C</>);
  namedPlug('root', 'X', () => <>X</>);
  namedPlug('root', 'Y', () => <>Y</>);
  register();

  loadPlugins();
  const renderer = createRenderer(
    <ArraySlot name="root" plugOrder={['A', 'B', 'C']} />,
  );
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    Array [
      "A",
      "B",
      "C",
      "X",
      "Y",
    ]
  `);
});

it('places unnamed plugs last', async () => {
  const { namedPlug, plug, register } = createPlugin<SortTest>({
    name: 'test',
  });
  namedPlug('root', 'B', () => <>B</>);
  namedPlug('root', 'A', () => <>A</>);
  namedPlug('root', 'C', () => <>C</>);
  plug('root', () => <>X</>);
  plug('root', () => <>Y</>);
  register();

  loadPlugins();
  const renderer = createRenderer(
    <ArraySlot name="root" plugOrder={['A', 'B', 'C']} />,
  );
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    Array [
      "A",
      "B",
      "C",
      "X",
      "Y",
    ]
  `);
});
