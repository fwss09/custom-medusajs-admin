import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { customCompleteCartWorkflow } from "../../../../../workflows/custom-complete-cart"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  try {
    const { result } = await customCompleteCartWorkflow(req.scope).run({
      input: { cart_id: id },
    })

    res.json({
      type: "order",
      order: result,
    })
  } catch (error: any) {
    console.error("Workflow error:", error)
    res.status(500).json({
      type: "error",
      message: error.message,
    })
  }
}