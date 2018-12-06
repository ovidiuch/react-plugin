import * as React from 'react';
import { create } from 'react-test-renderer';
import { mountPlugins, registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('receives props returned by getProps', () => {
  const { plug } = registerPlugin({ name: 'test' });
  plug({
    slotName: 'root',
    render: ({ name }: { name: string }) => <span>Hello {name}</span>,
    getProps: () => ({ name: 'Ellen' }),
  });

  mountPlugins();

  const wrapper = create(<Slot name="root" />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<span>
  Hello 
  Ellen
</span>
`);
});

it('calls getProps with plugin context', () => {
  const { plug } = registerPlugin({
    name: 'test',
    initialState: { age: 29 },
  });
  plug({
    slotName: 'root',
    render: ({ age }: { age: number }) => <span>{age}y old</span>,
    getProps: ({ getState }) => ({ age: getState().age }),
  });

  mountPlugins();

  const wrapper = create(<Slot name="root" />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<span>
  29
  y old
</span>
`);
});

it('calls getProps with slot props', () => {
  const { plug } = registerPlugin({ name: 'test' });
  plug({
    slotName: 'root',
    render: ({ age }: { age: number }) => <span>{age}y old</span>,
    getProps: (context, slotProps) => ({ age: slotProps.age }),
  });

  mountPlugins();

  const wrapper = create(<Slot name="root" props={{ age: 29 }} />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<span>
  29
  y old
</span>
`);
});
