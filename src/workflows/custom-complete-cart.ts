import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import {
  acquireLockStep,
  releaseLockStep,
  completeCartWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

type WorkflowInput = {
  cart_id: string
}

export const customCompleteCartWorkflow = createWorkflow(
  "custom-complete-cart",
  (input: WorkflowInput) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 30,
      ttl: 60 * 2,
    })

    const order = completeCartWorkflow.runAsStep({
      input: {
        id: input.cart_id,
      },
    })

    releaseLockStep({
      key: input.cart_id,
    })

    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "status",
        "payment_status",
        "payment_collections.*",
        "payment_collections.payments.*",
        "items.*",
        "shipping_address.*",
      ],
      filters: {
        id: order.id,
      },
    })

    return new WorkflowResponse(orders[0])
  }
)