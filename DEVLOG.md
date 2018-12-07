Q: Is the `getPluginContext` global method still needed if we use `addStateHandler` to subscribe to state changes inside Plugs?

Yes. Because we need to read current state on demand in Plug constructor.
