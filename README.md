[![CircleCI](https://circleci.com/gh/toggle-api/javascript-client/tree/master.svg?style=svg)](https://circleci.com/gh/toggle-api/javascript-client/tree/master)
[![npm version](https://img.shields.io/npm/v/toggle-api.svg)](https://www.npmjs.com/package/toggle-api)

# Javascript ToggleAPI Client
A javascript client library for ToggleAPI.

## Usage
This package provides a node compatible CommonJS build in the root and a concatenated UMD build in `bundles/`.

This package provides typescript definitions.

All examples are in ES6.

```
import { UserToggles } from 'toggle-api';

// (host, credentials, user_id, [anonymous], [app_version])
toggle = new UserToggles('http://api.toggleapi.com', 'server-api-key', 'userId', '2.0.1', false);

toggle.load().then(function () {
    // (toggle_id, default_value)
    if (toggle.getToggle('my-toggle', false)) {
        console.log('Enabled!');
    } else {
        console.log('Disabled!');
    }
});
```

## Build
This project can be built using: `npm run build`

## Test
This project can be tested using: `npm run test`
