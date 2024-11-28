import type {
  ColumnDef,
  Constraint,
  CreateStmt,
  Node,
  String as PgString,
} from '@pgsql/types'
import type { Columns, DBStructure, Table } from 'src/schema'
import type { RawStmtWrapper } from './parser'

// Transform function for AST to DBStructure
export const convertToDBStructure = (ast: RawStmtWrapper[]): DBStructure => {
  const tables: Record<string, Table> = {}

  function isStringNode(node: Node): node is { String: PgString } {
    return (node as { String: { str: string } }).String !== undefined
  }

  function isConstraintNode(node: Node): node is { Constraint: Constraint } {
    return (node as { Constraint: Constraint }).Constraint !== undefined
  }

  function isCreateStmt(stmt: Node): stmt is { CreateStmt: CreateStmt } {
    return 'CreateStmt' in stmt
  }

  if (!ast) {
    return {
      tables: {},
      relationships: {},
    }
  }

  for (const statement of ast) {
    if (statement?.RawStmt.stmt === undefined) continue
    const stmt = statement.RawStmt.stmt
    if (isCreateStmt(stmt)) {
      const createStmt = stmt.CreateStmt
      if (!createStmt || !createStmt.relation || !createStmt.tableElts) continue

      const tableName = createStmt.relation.relname
      const columns: Columns = {}
      createStmt.tableElts
        .filter(
          (elt: Node): elt is { ColumnDef: ColumnDef } => 'ColumnDef' in elt,
        )
        .map((elt) => {
          const colDef = elt.ColumnDef
          return {
            name: colDef.colname || '',
            type:
              colDef.typeName?.names
                ?.filter(isStringNode)
                .map((n) => n.String.sval)
                .join(' ') || '',
            default: '', // TODO
            check: '', // TODO
            primary:
              colDef.constraints
                ?.filter(isConstraintNode)
                .some((c) => c.Constraint.contype === 'CONSTR_PRIMARY') ||
              false,
            unique:
              colDef.constraints
                ?.filter(isConstraintNode)
                .some((c) => c.Constraint.contype === 'CONSTR_UNIQUE') || false,
            notNull:
              colDef.constraints
                ?.filter(isConstraintNode)
                .some((c) => c.Constraint.contype === 'CONSTR_NOTNULL') ||
              // If primary key, it's not null
              colDef.constraints
                ?.filter(isConstraintNode)
                .some((c) => c.Constraint.contype === 'CONSTR_PRIMARY') ||
              false,
            increment:
              colDef.typeName?.names
                ?.filter(isStringNode)
                .some((n) => n.String.sval === 'serial') || false,
            comment: '', // TODO
          }
        })

      if (tableName) {
        tables[tableName] = {
          name: tableName,
          columns,
          comment: null, // TODO
          indices: [], // TODO
        }
      }
    }
  }

  return {
    tables,
    relationships: {},
  }
}
