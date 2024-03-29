import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListofOrders } from './orders/List-of-Orders';
import moment from 'moment';

const fetchGenusOrdersApi = async (fromDate, toDate) => {
  const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD")
  const toDateFormatted = moment(toDate).format("yyyy-MM-DD")
  const res = await axios.get(`https://genus.rdfmis.ph/StoreAPI/api/orders.php?token=8AFASbzK5OH0E9OuZF5LlI9qZo8fqr1X&from=${fromDateFormatted}&to=${toDateFormatted}`)
  return res.data
}

const OrdersPage = ({ fetchNotification }) => {

  const dateVar = new Date()
  const startDate = moment(dateVar.setDate(dateVar.getDate() - 3)).format('yyyy-MM-DD')

  const [genusOrders, setGenusOrders] = useState([])

  const [fromDate, setFromDate] = useState(moment(new Date()).format('yyyy-MM-DD'))
  const [toDate, setToDate] = useState(moment(new Date()).format('yyyy-MM-DD'))

  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  const fetchGenusOrders = () => {
    fetchGenusOrdersApi(fromDate, toDate).then(res => {
      setGenusOrders(res)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (fromDate && toDate) {
      fetchGenusOrders()
    }

    return () => {
      setGenusOrders([])
    }
  }, [fromDate, toDate])

  return (
    <>
      <ListofOrders
        genusOrders={genusOrders} setGenusOrders={setGenusOrders} search={search} setSearch={setSearch} fetchingData={isLoading}
        setFromDate={setFromDate} setToDate={setToDate}
        fromDate={fromDate} toDate={toDate}
        fetchNotification={fetchNotification}
      />
    </>
  )
}

export default OrdersPage;
