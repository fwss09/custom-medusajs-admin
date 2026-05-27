import { defineRouteConfig } from "@medusajs/admin-sdk"
import { AdminOrder } from "@medusajs/framework/types"
import { ChartBar } from "@medusajs/icons"
import { sdk } from "../../lib/sdk"
import { useEffect, useState } from "react"
import { BarChart } from '@mui/x-charts/BarChart';
import { Container, Heading } from "@medusajs/ui"


const CustomPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      const data = await sdk.admin.order.list()
      setOrders(data.orders)
    }

    loadOrders()
  }, [])

  const statsByDay = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0]
  
    if (!acc[date]) {
      acc[date] = {
        orders: 0,
        revenue: 0,
      }
    }
  
    acc[date].orders += 1
    acc[date].revenue += order.total || 0
    console.log(order.total)
  
    return acc
  }, {} as Record<string, { orders: number; revenue: number }>)

  const chartLabels = Object.keys(statsByDay).sort()

  const ordersData = chartLabels.map((date) => statsByDay[date].orders)
  
  const revenueData = chartLabels.map((date) => statsByDay[date].revenue)

  return (
    <>
      <Container>
        <Heading>Замовлення</Heading>
  
        <BarChart
          xAxis={[
            {
              id: "days",
              data: chartLabels,
              scaleType: "band",
            },
          ]}
          series={[
            {
              label: "Замовлень",
              data: ordersData,
              color: "black",
            },
          ]}
          height={300}
        />
      </Container>
  
      <Container>
        <Heading>Дохід</Heading>
  
        <BarChart
          xAxis={[
            {
              id: "days",
              data: chartLabels,
              scaleType: "band",
            },
          ]}
          series={[
            {
              label: "Дохід",
              data: revenueData,
              color: "green",
            },
          ]}
          height={300}
        />
      </Container>
    </>
  )
}

export const config = defineRouteConfig({
  label: "Статистика",
  icon: ChartBar,
})

export default CustomPage