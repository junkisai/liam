import type { Relationships } from '@liam-hq/db-structure'
import type { Node } from '@xyflow/react'
import { useEffect } from 'react'
import type { TableNodeType } from './TableNode'
import { isTableNode } from './TableNode'

export const useUpdateNodeCardinalities = (
  nodes: Node[],
  relationships: Relationships,
  setNodes: (nodes: Node[]) => void,
) => {
  useEffect(() => {
    const hiddenNodes = nodes.filter((n) => n.hidden && isTableNode(n))

    const updatedNodes = nodes.map((node) => {
      const nodeData = node as TableNodeType
      const tableName = nodeData.data.table.name
      const targetColumnCardinalities = nodeData.data.targetColumnCardinalities

      if (!targetColumnCardinalities) return node

      for (const relationship of Object.values(relationships)) {
        if (relationship.foreignTableName !== tableName) continue

        const isPrimaryTableHidden = hiddenNodes.some(
          (hiddenNode) => hiddenNode.id === relationship.primaryTableName,
        )

        targetColumnCardinalities[relationship.foreignColumnName] =
          isPrimaryTableHidden ? undefined : relationship.cardinality
      }

      return {
        ...node,
        data: {
          ...nodeData.data,
          targetColumnCardinalities,
        },
      }
    })

    setNodes(updatedNodes)
  }, [nodes, relationships, setNodes])
}
