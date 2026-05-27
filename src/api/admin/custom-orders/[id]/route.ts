import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderModuleService = req.scope.resolve(Modules.ORDER)
  await orderModuleService.deleteOrders(req.params.id)
  res.json({ success: true })
}