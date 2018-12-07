Q: What happens to Slots when a plugin is disabled at run-time? How do Slots _react_ and hide automatically once they represent a disabled plugin?

Solution: A `loadPlugins` callback that fires whenever plugins change. Part of the `ui-plugin` API.

```jsx
loadPlugins({ config }, () => {
  // This 2nd argument can serve as a onPluginLoad handler, would typically be
  // called:
  // - Immediately
  // - After a new plugin is registered
  // - After a plugin's enabled state changes
  render(<Slot name="root")
});
```

---

Q: Is the `getPluginContext` global method still needed if we use `addStateHandler` to subscribe to state changes inside Plugs?

Yes. Because we need to read current state on demand in Plug constructor.
