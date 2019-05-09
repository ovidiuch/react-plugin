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

interface Test {
  name: 'test';
  state: { age: number };
}

it('renders component', () => {
  const { plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug('root', () => <AgeComponent age={29} />);
  register();

  loadPlugins();
  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('passes down pluginContext prop', () => {
  const { plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 29 },
  });
  plug('root', ({ pluginContext }) => (
    <AgeComponent age={pluginContext.getState().age} />
  ));
  register();

  loadPlugins();
  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('passes down slot props', () => {
  const { plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug<{ age: number }>('root', ({ slotProps }) => <AgeComponent age={slotProps.age} />);
  register();

  loadPlugins();
  const renderer = create(<Slot name="root" props={{ age: 29 }} />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('updates plug on plugin state change', async () => {
  const { onLoad, plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 29 },
  });
  onLoad(({ setState }) => {
    setTimeout(() => {
      setState({ age: 30 });
    });
  });
  plug('root', ({ pluginContext }) => (
    <AgeComponent age={pluginContext.getState().age} />
  ));
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
