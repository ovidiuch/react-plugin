import * as React from 'react';
import { create } from 'react-test-renderer';
import { Plug, Plugin, register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('takes slot away from other plugins', () => {
  // The first plugins removes up the possibility for a future plugin to
  // override it or to compose with it.
  register(
    <Plugin name="test">
      <Plug slot="root" render="I was here first" />
    </Plugin>,
  );

  // When this plugin is applied `root` slot doesn't exist anymore
  register(
    <Plugin name="test">
      <Plug slot="root" render="I was here second" />
    </Plugin>,
  );

  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I was here first"`);
});

function Root() {
  return <Slot name="root" />;
}
