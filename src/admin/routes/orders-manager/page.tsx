import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Trash } from "@medusajs/icons"
import { Container, Heading, Button, Table, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { sdk } from "../../lib/sdk"
import { AdminOrder } from "@medusajs/framework/types"

const OrdersManagerPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      const data = await sdk.admin.order.list()
      setOrders(data.orders)
    }
    loadOrders()
  }, [])

  const handleDelete = async (orderId: string) => {
    await sdk.client.fetch(`/admin/custom-orders/${orderId}`, {
      method: "DELETE",
    })
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  return (
    <Container>
      <Heading level="h1" className="mb-2">Видалення Замовлень</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Статус</Table.HeaderCell>
            <Table.HeaderCell>Сума</Table.HeaderCell>
            <Table.HeaderCell>Дія</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.display_id}</Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>{order.total}</Table.Cell>
              <Table.Cell>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(order.id)}
                >
                  <Trash /> Видалити
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
          {orders.length == 0 && (
            <Table.Row>
              <Table.Cell>---</Table.Cell>
              <Table.Cell>---</Table.Cell>
              <Table.Cell>---</Table.Cell>
              <Table.Cell>---</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Видалення Замовлень",
  icon: Trash,
})

export default OrdersManagerPage