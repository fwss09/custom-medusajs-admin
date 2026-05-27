import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Avatar } from "@medusajs/ui"
import { useEffect, useState } from "react"

const VariantRanksPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [ranks, setRanks] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/admin/products?fields=*variants", { credentials: "include" })
      .then((res) => res.json())
      .then(({ products }) => {
        setProducts(products)
        const initialRanks: Record<string, number> = {}
        products.forEach((p: any) =>
          p.variants?.forEach((v: any, i: number) => {
            initialRanks[v.id] = v.variant_rank ?? i
          })
        )
        setRanks(initialRanks)
      })
  }, [])

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await Promise.all(
        products.map((product) =>
          fetch(`/admin/products/${product.id}/variants/batch`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              update: product.variants?.map((variant: any) => ({
                id: variant.id,
                variant_rank: ranks[variant.id] ?? 0,
              })),
            }),
          })
        )
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Variant Ranks</Heading>
      </div>
      <div className="px-6 py-4 flex flex-col gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-white p-4 rounded-lg">
              <img src={product.images[0].url} width={'128'} height={'128'} />
              <Heading level="h3">{product.title}</Heading>
              <div className="flex flex-col gap-2 mt-2">
                {product.variants?.map((variant: any) => (
                  <div key={variant.id} className="flex items-center gap-4">
                    <span className="w-32">{variant.title}</span>
                    <input
                      type="number"
                      value={ranks[variant.id] ?? 0}
                      onChange={(e) =>
                        setRanks((prev) => ({ ...prev, [variant.id]: Number(e.target.value) }))
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={handleSaveAll} isLoading={saving}>
            Save All
          </Button>
        </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Variant Ranks",
})

export default VariantRanksPage