import React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, Zone } from '../';
import { __reset } from '../store';

beforeEach(__reset);

it('overrides plugin previously applied on same zone', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The former is happening in this case.
  registerPlugin('root', <Zone name="root">I was here first</Zone>);
  registerPlugin('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});

function Root() {
  return <Zone name="root" />;
}
