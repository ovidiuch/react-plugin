import retry from '@skidding/async-retry';
import * as React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { loadPlugins, registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

function AgeComponent({ age }: { age: number }) {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>{`${age}y old`}</>;
}

it('receives props returned by getProps', () => {
  const { plug } = registerPlugin({ name: 'test' });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: () => ({ age: 29 }),
  });

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('calls getProps with plugin context', () => {
  const { plug } = registerPlugin({
    name: 'test',
    initialState: { age: 29 },
  });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: ({ getState }) => ({ age: getState().age }),
  });

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('calls getProps with slot props', () => {
  const { plug } = registerPlugin({ name: 'test' });
  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: (context, slotProps) => ({ age: slotProps.age }),
  });

  loadPlugins();

  const renderer = create(<Slot name="root" props={{ age: 29 }} />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"29y old"`);
});

it('updates plug on plugin state change', async () => {
  const { init, plug } = registerPlugin({
    name: 'test',
    initialState: { age: 29 },
  });

  init(({ setState }) => {
    setTimeout(() => {
      setState({ age: 30 });
    });
  });

  plug({
    slotName: 'root',
    render: AgeComponent,
    getProps: ({ getState }) => ({ age: getState().age }),
  });

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
