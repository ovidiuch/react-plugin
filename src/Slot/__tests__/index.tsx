import retry from '@skidding/async-retry';
import React from 'react';
import { act, ReactTestRenderer } from 'react-test-renderer';
import { loadPlugins, PluginContext } from 'ui-plugin';
import { Slot } from '../Slot';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../pluginStore';
import { createRenderer } from '../../testHelpers/createRenderer';

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

it('renders component', async () => {
  const { plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug('root', () => <AgeComponent age={29} />);
  register();

  loadPlugins();
  const renderer = createRenderer(<Slot name="root" />);
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
  const renderer = createRenderer(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

// This is an integration test because the memoization is done by ui-plugin
it('passes down memoized pluginContext prop', async () => {
  const { onLoad, plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 29 },
  });
  const pluginContexts: PluginContext<Test>[] = [];
  plug('root', ({ pluginContext }) => {
    pluginContexts.push(pluginContext);
    return null;
  });
  onLoad(({ setState }) => {
    setTimeout(() => {
      act(() => {
        setState({ age: 30 });
      });
    });
  });
  register();

  loadPlugins();
  createRenderer(<Slot name="root" />);
  await retry(() => {
    expect(pluginContexts.length).toBe(2);
    expect(pluginContexts[0]).toBe(pluginContexts[1]);
  });
});

it('passes down slot props', () => {
  const { plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 28 },
  });
  plug<{ age: number }>('root', ({ slotProps }) => (
    <AgeComponent age={slotProps.age} />
  ));
  register();

  loadPlugins();
  const renderer = createRenderer(<Slot name="root" slotProps={{ age: 29 }} />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('updates plug on plugin state change', async () => {
  const { onLoad, plug, register } = createPlugin<Test>({
    name: 'test',
    initialState: { age: 29 },
  });
  plug('root', ({ pluginContext }) => (
    <AgeComponent age={pluginContext.getState().age} />
  ));
  onLoad(({ setState }) => {
    setTimeout(() => {
      act(() => {
        setState({ age: 30 });
      });
    });
  });
  register();

  loadPlugins();
  const renderer = createRenderer(<Slot name="root" />);
  await retry(() => {
    // expect().toMatchInlineSnapshot can't be placed inside async retry()
    expect(getAgeProp(renderer)).toEqual(30);
  });
});

function getAgeProp(renderer: ReactTestRenderer) {
  return renderer.root.findByType(AgeComponent).props.age;
}
