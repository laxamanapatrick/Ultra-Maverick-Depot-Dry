// Old UI

// import React, { useState, useEffect } from 'react'
// import { VStack } from '@chakra-ui/react'
// import apiClient from '../../services/apiClient'
// import { ListofOrders } from './preparationschedule/List-of-Orders'
// import { usePagination } from '@ajna/pagination';

// const fetchFarmOrdersApi = async (pageNumber) => {
//   const res = await apiClient.get(`Ordering/GetAllListOfOrdersPagination?pageSize=1&pageNumber=${pageNumber}`)
//   return res.data
// }

// const PreparationSchedulePage = ({ fetchNotification }) => {

//   const [farmName, setFarmName] = useState("")
//   const [orders, setOrders] = useState([])

//   const [transactId, setTransactId] = useState(null)

//   const [lengthIndicator, setLengthIndicator] = useState('')

//   const [pageTotal, setPageTotal] = useState(undefined);
//   const outerLimit = 2;
//   const innerLimit = 2;
//   const { currentPage, setCurrentPage, pagesCount } = usePagination({
//     total: pageTotal,
//     limits: {
//       outer: outerLimit,
//       inner: innerLimit,
//     },
//     initialState: { currentPage: 1, pageSize: 1 },
//   })

//   const fetchFarmOrders = () => {
//     fetchFarmOrdersApi(currentPage).then(res => {
//       setFarmName(res.orders[0]?.farm)
//       setPageTotal(res.totalCount)
//     })
//   }

//   useEffect(() => {
//     fetchFarmOrders()

//     return () => {
//       setFarmName("")
//     }
//   }, [currentPage])

//   const fetchOrdersApi = async () => {
//     const res = await apiClient.get(`Ordering/GetAllListofOrders`, {
//       params: {
//         farms: farmName,
//       },})
//     return res.data
//   }

//   const fetchOrders = () => {
//     fetchOrdersApi(farmName).then(res => {
//       setOrders(res)
//       setLengthIndicator(res.length)
//     })
//   }

//   useEffect(() => {
//     if (farmName) {
//       fetchOrders()
//     }

//     return () => {
//       setOrders([])
//     }
//   }, [farmName])

//   return (
//     <>
//       <VStack w='full' h='auto'>
//         <ListofOrders
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           pagesCount={pagesCount}
//           setFarmName={setFarmName}
//           farmName={farmName}
//           orders={orders}
//           pageTotal={pageTotal}
//           setTransactId={setTransactId}
//           transactId={transactId}
//           fetchFarmOrders={fetchFarmOrders}
//           fetchOrders={fetchOrders}
//           lengthIndicator={lengthIndicator}
//           fetchNotification={fetchNotification}
//         />
//       </VStack>
//     </>
//   )
// }

// export default PreparationSchedulePage;

//New UI

import React, { useEffect, useState } from "react";
import ListofCustomers from "./preparationschedule/List-of-Customers";
import { Text, VStack } from "@chakra-ui/react";
import { ListofOrders } from "./preparationschedule/List-of-Orders";
import apiClient from "../../services/apiClient";

const PreparationSchedulePage = ({ fetchNotification }) => {
  const [farmName, setFarmName] = useState("");
  const [orders, setOrders] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const fetchOrdersApi = async () => {
    const res = await apiClient.get(`Ordering/GetAllListofOrders`, {
      params: {
        farms: farmName,
      },
    });
    return res.data;
  };

  const fetchOrders = () => {
    fetchOrdersApi(farmName).then((res) => {
      setOrders(res);
    });
  };

  useEffect(() => {
    if (farmName) {
      fetchOrders();
    }

    return () => {
      setOrders([]);
    };
  }, [farmName]);

  return (
    <>
      <VStack spacing={0} w="full" h="auto">
        <Text w='full' color='white' bgColor='secondary' textAlign='center'>Preparation Schedule</Text>
        <ListofCustomers
          farmName={farmName}
          setFarmName={setFarmName}
          fetchNotification={fetchNotification}
          setCheckedItems={setCheckedItems}
        />

        {farmName && (
          <ListofOrders
            farmName={farmName}
            setFarmName={setFarmName}
            orders={orders}
            fetchOrders={fetchOrders}
            fetchNotification={fetchNotification}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
          />
        )}
      </VStack>
    </>
  );
};

export default PreparationSchedulePage;
