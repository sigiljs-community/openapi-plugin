export interface ExportedRouteDetails {
  method: string
  path: string
  schema: Partial<{
    body: Record<string, any>
    headers: Record<string, any>
    query: Record<string, any>
    params: Record<string, any>
  }>
  tags: string[]
  meta: Record<string, any>
}