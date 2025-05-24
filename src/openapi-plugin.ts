import {
  OpenApiTransformer,
  OpenApiTransformerInfoOptions,
  OpenApiTransformerTransformOptions
} from "@sigiljs/openapi-transformer"
import { SigilPlugin } from "@sigiljs/sigil"
import { RawResponse } from "@sigiljs/sigil/responses"
import { nonNullable, sanitizePath } from "@sigiljs/sigil/utils"
import { ExportedRouteDetails } from "./types"

export interface OpenApiPluginConfig {
  info?: OpenApiTransformerInfoOptions
  transform?: OpenApiTransformerTransformOptions
  path?: string | false
}

export default class OpenApiPlugin extends SigilPlugin<OpenApiPluginConfig> {
  public static name = "OpenApiPlugin"

  public openApiDefinition: Record<string, any> = {}
  readonly #openApiTransformer?: { transform: (routes: ExportedRouteDetails[]) => Record<string, any> }

  readonly #path?: string

  constructor() {
    super()

    const { info, transform, path } = this.$pluginConfig

    if (path !== false) {
      this.#path = nonNullable((path ?? "/swagger.json").split("/")).join("/")
      if (!this.#path.startsWith("/") && !this.#path.startsWith("./")) this.#path = "/" + this.#path
    }

    this.#openApiTransformer = new OpenApiTransformer({
      ...info,
      responseTemplate: this.$responseTemplate,
      transform
    })
  }

  public onInitialize(): any {
    if (this.#path) this.sigil.route("/").get(this.#path, () => new RawResponse(this.openApiDefinition))
  }

  public onUpdateCallback(): any {
    if (!this.#openApiTransformer) return

    const requests: ExportedRouteDetails[] = []
    this.$routes.forEach(([path, route]) => {
      const _req = nonNullable(route.exportRequests.map(request => {
        let _path = (path + request.path).replace(/\/{2,}/g, "/")
        if (_path.endsWith("/")) _path = _path.slice(0, -1)

        if (this.#path && _path === this.#path) return null

        return {
          method: request.method,
          path: _path,
          schema: request.flatSchema,
          meta: request.metadata ?? {},
          tags: route.routeOptions?.tags ?? nonNullable([sanitizePath(path, " ") || null])
        }
      }))

      requests.push(..._req)
    })

    this.openApiDefinition = this.#openApiTransformer.transform(requests)
  }
}