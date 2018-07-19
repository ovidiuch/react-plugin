import React from 'react';
import { create } from 'react-test-renderer';
import { Slot } from '../';
import { __reset } from '../store';
import { registerPlug } from './_helpers';

afterEach(__reset);

it('composes plugins registered inside-out', () => {
  registerPreviewIframe();

  // Assert checkpoint
  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<iframe
  src="_loader.html"
/>
`);

  registerNav();

  // Assert final composition
  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
  <iframe
    src="_loader.html"
  />
</div>
`);
});

it('composes plugins registered outside-in', () => {
  registerNav();
  const wrapper = create(<Root />);

  // Assert checkpoint
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
</div>
`);

  registerPreviewIframe();

  // Assert final composition
  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
  <iframe
    src="_loader.html"
  />
</div>
`);
});

function registerPreviewIframe() {
  registerPlug(
    'root',
    <Slot name="root">
      <Preview />
    </Slot>
  );
}

function registerNav() {
  registerPlug('root', ({ children }) => (
    <div>
      <Nav />
      <Slot name="root">{children}</Slot>
    </div>
  ));
}

function Root() {
  return <Slot name="root" />;
}

function Nav() {
  return <div className="nav" />;
}

function Preview() {
  return <iframe src="_loader.html" />;
}
