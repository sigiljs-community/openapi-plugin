# Sigil OpenAPI Plugin

Automatically generates and serves an OpenAPI 3.0 JSON specification from your Sigil routes and validation schemas.


## Features

**Automatic spec derivation**: Inspects registered routes, HTTP methods, path parameters, query/header/body schemas, and response metadata.

**Spec serving**: Hosts the generated JSON at a configurable endpoint (default: `/openapi.json`).

**Swagger UI support**: Easily mount Swagger UI or other OpenAPI viewers against the served spec.


## Installation

```bash
npm install @sigiljs-community/openapi-plugin
# or
yarn add @sigiljs-community/openapi-plugin
```


## Usage

**Import and register the plugin**

```typescript
import { Sigil } from "@sigiljs/sigil"
import { OpenApiPlugin } from "@sigiljs-community/openapi-plugin"

const app = new Sigil()

// Register the OpenAPI plugin with optional settings
app.addPlugin(OpenApiPlugin, {
  /**
   * URL path where the JSON will be served
   * (defaults to '/swagger.json').
   */
  path: "/swagger.json",

  /**
   * Optional API metadata, if not provided, will
   * be replaced with placeholders
   */
  info: {
    title: "My API",
    version: "1.0.0",
    description: "Auto-generated OpenAPI spec"
  }
})
```

**Define your routes and schemas**

```typescript
// Example route with validation
import { seal } from "@sigiljs/sigil"

const schema = app.defineSchema({ id: seal.string.optional })

app.route("/users")
  .query(...schema)
  .get((req, res) => res.response({ users: [] }))
```

**Serve and view the spec**

Start your server and navigate to `http://localhost:3000/docs/openapi.json`

```ts
// Start server
app.listen(3000)
```

> Note: this plugin does not provide UI. For front-ends, please refer
> to the @sigiljs-community/swagger-ui-plugin or similar plugins

## License

You can copy and paste the MIT license summary from below.

```text
MIT License

Copyright (c) 2022 Kurai Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

