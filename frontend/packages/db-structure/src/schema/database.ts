import * as v from 'valibot'

const fieldNameSchema = v.string()

export const tableNameSchema = v.string()

const relationshipNameSchema = v.string()

const fieldSchema = v.object({
  name: fieldNameSchema,
  type: v.string(),
  default: v.string(),
  check: v.string(),
  primary: v.boolean(),
  unique: v.boolean(),
  notNull: v.boolean(),
  increment: v.boolean(),
  comment: v.string(),
})

const indexSchema = v.object({
  name: v.string(),
  unique: v.boolean(),
  fields: v.array(v.string()),
})

export const tableSchema = v.object({
  name: tableNameSchema,
  fields: v.array(fieldSchema),
  comment: v.nullable(v.string()),
  indices: v.array(indexSchema),
})

export type Table = v.InferOutput<typeof tableSchema>

const tablesSchema = v.record(tableNameSchema, tableSchema)

const relationshipSchema = v.object({
  name: relationshipNameSchema,
  startTableName: tableNameSchema,
  startFieldName: fieldNameSchema,
  endTableName: tableNameSchema,
  endFieldName: fieldNameSchema,
  cardinality: v.string(),
  updateConstraint: v.string(),
  deleteConstraint: v.string(),
})

export const relationshipsSchema = v.record(
  relationshipNameSchema,
  relationshipSchema,
)

export const dbStructureSchema = v.object({
  tables: tablesSchema,
  relationships: relationshipsSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
