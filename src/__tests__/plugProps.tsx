import retry from '@skidding/async-retry';
import * as React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { loadPlugins, createPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

function AgeComponent({ age }: { age: number }) {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>{`${age}y old`}</>;
}

interface ITest {
  name: 'test';
  state: { age: number };
}

it('receives props returned by getProps', () => {
  const { plug, register } = createPlugin<ITest>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: () => ({ age: 29 }),
  });
  register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('calls getProps with plugin context', () => {
  const { plug, register } = createPlugin<ITest>({
    name: 'test',
    initialState: { age: 29 },
  });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: ({ getState }) => ({ age: getState().age }),
  });
  register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('calls getProps with slot props', () => {
  const { plug, register } = createPlugin<ITest>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: (context, slotProps) => ({ age: slotProps.age }),
  });
  register();

  loadPlugins();

  const renderer = create(<Slot name="root" props={{ age: 29 }} />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('updates plug on plugin state change', async () => {
  const { onLoad, plug, register } = createPlugin<ITest>({
    name: 'test',
    initialState: { age: 29 },
  });
  onLoad(({ setState }) => {
    setTimeout(() => {
      setState({ age: 30 });
    });
  });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: ({ getState }) => ({ age: getState().age }),
  });
  register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  await retry(() => {
    // expect().toMatchInlineSnapshot can't be placed inside async retry()
    expect(getAgeProp(renderer)).toEqual(30);
  });
});

function getAgeProp(renderer: ReactTestRenderer) {
  return renderer.root.findByType(AgeComponent).props.age;
}
