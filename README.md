# Javascript ToggleAPI Client
A javascript client library for ToggleAPI.

## Usage
This package provides a node compatible CommonJS build in the root and a concatenated UMD build in `bundles/`.

This package provides typescript definitions.

All examples are in ES6.

```
import { UserToggles } from 'toggle-api';

// (credentials, user_id, app_version, anonymous)
toggle = new UserToggle('server-api-key', 'userId', '2.0.1', false);

toggle.waitForLoad().then(function () {
    // (toggle_id, default_value)
    if (toggle.getTruthyToggle('my-toggle', false)) {
        console.log('Enabled!');
    } else {
        console.log('Disabled!');
    }
});
```

## Build
This project can be built using: `npm run build`
