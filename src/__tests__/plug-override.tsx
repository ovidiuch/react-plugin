import * as React from 'react';
import { create } from 'react-test-renderer';
import { Plug, Plugin, register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('overrides plug previously applied on same slot', () => {
  // The first plugs opens up the possibility for a future plug to override
  // it or to compose with it. The former is happening in this case.
  register(
    <Plugin name="test">
      <Plug slot="root" render={<Slot name="root">I was here first</Slot>} />
    </Plugin>,
  );
  register(
    <Plugin name="test">
      <Plug slot="root" render="I was here second" />
    </Plugin>,
  );

  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});

function Root() {
  return <Slot name="root" />;
}
