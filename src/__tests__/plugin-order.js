import React from 'react';
import { create } from 'react-test-renderer';
import { register, Zone } from '../';
import { __reset } from '../store';

beforeEach(__reset);

// TODO: Document types of plugins. Eg.
// - Plugin that injects itself into a zone and overrides any other children (from other plugins)
// - Plugin that injects itself into a zone and sits beside other children (from other plugins)
// - Plugin that consumes/overrides/replaces/takes up a zone and injects the zone inside itself (for other plugins to inject there)
// - Plugin that consumes/overrides/replaces/takes up a zone and doesn't allow any other plugin to use that zone afterwards

it('should compose plugins registered inside-out', () => {
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

it('should compose plugins registered outside-in', () => {
  registerNav();
  const wrapper = create(<Root />);

  // Assert checkpoint
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
  [zone 'preview' end]
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
  // XXX Facts:
  // - Anything that was plugged into `preview` will render _around_ <Preview />.
  // - This plugin will override any other child plugins of the `preview` zone
  register(
    'preview',
    <Zone name="preview">
      <Preview />
    </Zone>
  );
  // XXX Alt.
  // register('preview', ({ children }) => (
  //   <Zone name="preview">
  //     <Preview />
  //   </Zone>
  // ));
}

function registerNav() {
  // XXX Facts:
  // - Render <Nav /> alongside anything that was plugged into `preview`
  register('preview', ({ children }) => (
    <div>
      <Nav />
      <Zone name="preview">{children}</Zone>
    </div>
  ));
}

function Root() {
  return <Zone name="preview" />;
}

function Nav() {
  return <div className="nav" />;
}

function Preview() {
  return <iframe src="_loader.html" />;
}
