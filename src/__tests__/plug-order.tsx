import * as React from 'react';
import { create } from 'react-test-renderer';
import { Plug, Plugin, register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('composes plugs registered inside-out', () => {
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

it('composes plugs registered outside-in', () => {
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
  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={
          <Slot name="root">
            <Preview />
          </Slot>
        }
      />
    </Plugin>,
  );
}

function registerNav() {
  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={({ children }: { children?: React.ReactNode }) => (
          <div>
            <Nav />
            <Slot name="root">{children}</Slot>
          </div>
        )}
      />
    </Plugin>,
  );
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
