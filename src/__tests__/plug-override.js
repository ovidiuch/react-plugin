import React from 'react';
import { create } from 'react-test-renderer';
import { Slot } from '../';
import { __reset } from '../store';
import { registerPlug } from './_helpers';

afterEach(__reset);

it('overrides plug previously applied on same slot', () => {
  // The first plugs opens up the possibility for a future plug to override
  // it or to compose with it. The former is happening in this case.
  registerPlug('root', <Slot name="root">I was here first</Slot>);
  registerPlug('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});

function Root() {
  return <Slot name="root" />;
}
