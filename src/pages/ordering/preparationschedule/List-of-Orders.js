// Old UI

// import React, { useState, useEffect } from "react";
// import {
//   Badge,
//   Box,
//   Button,
//   Checkbox,
//   Flex,
//   HStack,
//   Input,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useDisclosure,
//   VStack,
// } from "@chakra-ui/react";
// import {
//   Pagination,
//   usePagination,
//   PaginationNext,
//   PaginationPage,
//   PaginationPrevious,
//   PaginationContainer,
//   PaginationPageGroup,
// } from "@ajna/pagination";
// import PageScrollReusable from "../../../components/PageScroll-Reusable";
// import { TiInfo } from "react-icons/ti";
// import {
//   CancelModalConfirmation,
//   EditModal,
//   ScheduleConfirmation,
// } from "./Action-Modals";
// import moment from "moment";

// export const ListofOrders = ({
//   setCurrentPage,
//   currentPage,
//   pagesCount,
//   farmName,
//   setFarmName,
//   orders,
//   pageTotal,
//   setTransactId,
//   transactId,
//   fetchOrders,
//   fetchFarmOrders,
//   lengthIndicator,
//   fetchNotification,
// }) => {
//   const [editData, setEditData] = useState({
//     transactId: "",
//     farm: "",
//     itemCode: "",
//     itemDescription: "",
//     uom: "",
//     quantiy: "",
//   });
//   const [cancelId, setCancelId] = useState("");

//   const [checkedItems, setCheckedItems] = useState([]);

//   const orderCategories = orders?.map((item) => {
//     return {
//       category: item.category,
//     };
//   });
//   const filteredCategories = [
//     ...new Set(orderCategories?.map((item) => item.category)),
//   ];
//   const sortedCategories = [...filteredCategories].sort((a, b) =>
//     a.category > b.category ? 1 : -1
//   );

//   const [keyword, setKeyword] = useState("");

//   // const dateToday = new Date()
//   // const [dateNeeded, setDateNeeded] = useState('')
//   const [disableIfStock, setDisableIfStock] = useState(false);

//   const {
//     isOpen: isEdit,
//     onOpen: openEdit,
//     onClose: closeEdit,
//   } = useDisclosure();
//   const {
//     isOpen: isCancel,
//     onOpen: openCancel,
//     onClose: closeCancel,
//   } = useDisclosure();
//   const {
//     isOpen: isSchedule,
//     onOpen: openSchedule,
//     onClose: closeSchedule,
//   } = useDisclosure();

//   const handlePageChange = (nextPage) => {
//     setCheckedItems([]);
//     setCurrentPage(nextPage);
//   };

//   const editHandler = ({
//     id,
//     farm,
//     itemCode,
//     itemDescription,
//     uom,
//     quantityOrder,
//   }) => {
//     if (id && farm && itemCode && itemDescription && uom && quantityOrder) {
//       setEditData({
//         transactId: id,
//         farm: farm,
//         itemCode: itemCode,
//         itemDescription: itemDescription,
//         uom: uom,
//         quantiy: quantityOrder,
//       });
//       openEdit();
//     } else {
//       setEditData({
//         transactId: "",
//         farm: "",
//         itemCode: "",
//         itemDescription: "",
//         uom: "",
//         quantiy: "",
//       });
//     }
//   };

//   const cancelHandler = ({ id }) => {
//     console.log(id);
//     if (id) {
//       setCancelId(id);
//       openCancel();
//     } else {
//       setCancelId("");
//     }
//   };

//   // Buton disable for out of stock and backdated date needed
//   useEffect(() => {
//     orders.map((item) => {
//       setTransactId(item.id);
//       // || item.days < 0
//       if (item.stockOnHand < item.allocatedQuantity) {
//         setDisableIfStock(true);
//       } else {
//         setDisableIfStock(false);
//       }
//     });
//   }, [orders]);

//   //refetch if data length === 0
//   // useEffect(() => {
//   //     if (lengthIndicator === 0 && currentPage === 1) {
//   //         fetchFarmOrders()
//   //         fetchOrders()
//   //     }
//   //     if (lengthIndicator === 0 && currentPage !== 1) {
//   //         setCurrentPage(1)
//   //         fetchOrders()
//   //     }
//   // }, [lengthIndicator])

//   const stockAvailable = orders?.filter(
//     (item) => item.stockOnHand >= item.quantityOrder
//   );
//   const filteredStockAvailable = stockAvailable?.filter((item) => {
//     if (keyword) {
//       return item.category === keyword;
//     } else {
//       return stockAvailable;
//     }
//   });
//   const stockData = filteredStockAvailable?.map((item) => item.id);
//   const parentCheckHandler = (e) => {
//     if (e.target.checked) {
//       setCheckedItems(stockData);
//     } else {
//       setCheckedItems([]);
//     }
//   };

//   const childCheckHandler = (e) => {
//     if (e.target.checked) {
//       setCheckedItems([...checkedItems, parseInt(e.target.value)]);
//     } else {
//       const data = checkedItems?.filter(
//         (item) => item !== parseInt(e.target.value)
//       );
//       setCheckedItems(data);
//     }
//   };

//   const scheduleHandler = () => {
//     openSchedule();
//   };

//   return (
//     <Flex w="full" p={7} flexDirection="column">
//       <Flex w="full" justifyContent="space-between">
//         <HStack w="auto">
//           <Badge bgColor="secondary" color="white" px={3}>
//             Customer:{" "}
//           </Badge>
//           <Text fontSize="sm">{farmName && farmName}</Text>
//         </HStack>

//         <HStack w="auto">
//           <Badge bgColor="secondary" color="white" px={3}>
//             Category:{" "}
//           </Badge>
//           <Select
//             placeholder="Select a Category"
//             onChange={(e) => {setKeyword(e.target.value); setCheckedItems([])}}
//           >
//             {sortedCategories?.map((item) => (
//               <option value={item} key={item}>
//                 {item}
//               </option>
//             ))}
//           </Select>
//         </HStack>

//         <Flex w="auto">
//           <Pagination
//             pagesCount={pagesCount}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           >
//             <PaginationContainer>
//               <PaginationPrevious
//                 border="1px"
//                 fontSize="xs"
//                 px={2}
//                 _hover={{ bg: "accent", color: "white" }}
//               >
//                 {"< Previous"}
//               </PaginationPrevious>
//               <Text mx={1} bgColor="secondary" color="white" px={2} pt={1.5}>
//                 {currentPage}
//               </Text>
//               <PaginationNext
//                 border="1px"
//                 fontSize="xs"
//                 px={4}
//                 _hover={{ bg: "accent", color: "white" }}
//               >
//                 {"Next >"}
//               </PaginationNext>
//             </PaginationContainer>
//           </Pagination>
//         </Flex>
//       </Flex>

//       <VStack w="full" spacing={0} justifyContent="center" mt={10}>
//         <Text w="full" textAlign="start" fontSize="sm" fontWeight="semibold">
//           {pageTotal && pageTotal} Remaining Orders
//         </Text>
//         <Text
//           w="full"
//           fontWeight="semibold"
//           fontSize="xl"
//           bgColor="secondary"
//           color="white"
//           textAlign="center"
//         >
//           List of Orders
//         </Text>
//         <PageScrollReusable minHeight="150px" maxHeight="640px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary" top={0} position='sticky' zIndex='1'>
//               <Tr>
//                 <Th>
//                   <Checkbox
//                     onChange={parentCheckHandler}
//                     isChecked={stockData?.length === checkedItems?.length}
//                     disabled={!stockData?.length > 0}
//                     color="white"
//                   >
//                     Line
//                   </Checkbox>
//                 </Th>
//                 <Th color="white">ID</Th>
//                 <Th color="white">Order Date</Th>
//                 <Th color="white">Date Needed</Th>
//                 <Th color="white">Customer Code</Th>
//                 <Th color="white">Customer Name</Th>
//                 <Th color="white">Category</Th>
//                 <Th color="white">Item Code</Th>
//                 <Th color="white">Item Description</Th>
//                 <Th color="white">UOM</Th>
//                 <Th color="white">Quantity Order</Th>
//                 {/* <Th color='white'>Allocated Quantity</Th> */}
//                 <Th color="white">Reserve</Th>
//                 <Th color="white">Edit</Th>
//                 <Th color="white">Cancel</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {orders
//                 ?.filter((val) => {
//                   const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
//                   return val.category?.toLowerCase().match(newKeyword, "*");
//                 })
//                 ?.map((item, i) => (
//                   <Tr
//                     bgColor={
//                       item.stockOnHand < item.quantityOrder
//                         ? "#dfdfdf5c"
//                         : "none"
//                     }
//                     color={
//                       item.stockOnHand < item.quantityOrder ? "black" : "none"
//                     }
//                     _active={
//                       transactId
//                         ? { bgColor: "accent", color: "white" }
//                         : { bgColor: "none" }
//                     }
//                     _hover={
//                       transactId
//                         ? { bgColor: "accent", color: "white" }
//                         : { bgColor: "none" }
//                     }
//                     cursor="pointer"
//                     key={i}
//                   >
//                     {item.stockOnHand >= item.quantityOrder ? (
//                       <Td>
//                         <Checkbox
//                           onChange={childCheckHandler}
//                           isChecked={checkedItems.includes(item.id)}
//                           value={item.id}
//                           color="black"
//                         >
//                           {i + 1}
//                         </Checkbox>
//                       </Td>
//                     ) : (
//                       <Td>
//                         <HStack>
//                           <TiInfo
//                             fontSize="22px"
//                             color="red"
//                             title="Not enough stocks"
//                           />
//                           <Text>{i + 1}</Text>
//                         </HStack>
//                       </Td>
//                     )}
//                     <Td>{item.id}</Td>
//                     <Td>{item.orderDate}</Td>
//                     <Td>{item.dateNeeded}</Td>
//                     <Td>{item.farmCode}</Td>
//                     <Td>{item.farm}</Td>
//                     <Td>{item.category.toUpperCase()}</Td>
//                     <Td>{item.itemCode}</Td>
//                     <Td>{item.itemDescription}</Td>
//                     <Td>{item.uom}</Td>
//                     <Td>
//                       {item.quantityOrder?.toLocaleString(undefined, {
//                         maximumFractionDigits: 2,
//                         minimumFractionDigits: 2,
//                       })}
//                     </Td>
//                     {/* <Td>{item.allocatedQuantity?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
//                     <Td>{item.stockOnHand}</Td>
//                     <Td>
//                       <Button
//                         onClick={() => editHandler(item)}
//                         disabled={item.stockOnHand === 0}
//                         size="xs"
//                         colorScheme="yellow"
//                         color="white"
//                         px={4}
//                       >
//                         Edit
//                       </Button>
//                     </Td>

//                     <Td>
//                       <Button
//                         onClick={() => cancelHandler(item)}
//                         size="xs"
//                         colorScheme="red"
//                       >
//                         Cancel
//                       </Button>
//                     </Td>
//                   </Tr>
//                 ))}
//             </Tbody>
//           </Table>
//         </PageScrollReusable>
//         <Flex w="full" justifyContent="space-between" py={2} px={2}>
//           <Text fontSize="xs">Selected Item(s): {checkedItems?.length}</Text>
//           <Button
//             onClick={scheduleHandler}
//             title={
//               !checkedItems?.length > 0
//                 ? disableIfStock
//                   ? "Stocks must be available"
//                   : "Please select an order to schedule"
//                 : !checkedItems?.length > 0 || disableIfStock
//                 ? "Stocks must be available"
//                 : "Schedule order(s)"
//             }
//             disabled={!checkedItems?.length > 0 || disableIfStock}
//             size="sm"
//             px={3}
//             colorScheme="blue"
//           >
//             Schedule
//           </Button>
//         </Flex>
//       </VStack>

//       {isEdit && (
//         <EditModal
//           isOpen={isEdit}
//           onClose={closeEdit}
//           editData={editData}
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           fetchOrders={fetchOrders}
//         />
//       )}

//       {isCancel && (
//         <CancelModalConfirmation
//           isOpen={isCancel}
//           onClose={closeCancel}
//           cancelId={cancelId}
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           fetchOrders={fetchOrders}
//           fetchNotification={fetchNotification}
//         />
//       )}

//       {isSchedule && (
//         <ScheduleConfirmation
//           checkedItems={checkedItems}
//           setCheckedItems={setCheckedItems}
//           isOpen={isSchedule}
//           onClose={closeSchedule}
//           farmName={farmName}
//           fetchOrders={fetchOrders}
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           fetchNotification={fetchNotification}
//         />
//       )}
//     </Flex>
//   );
// };

// New UI - Rows

import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import { TiInfo } from "react-icons/ti";
import {
  CancelModalConfirmation,
  EditModal,
  ScheduleConfirmation,
} from "./Action-Modals";
import moment from "moment";
import { LoadingRecords, NoDataFound } from "../../../assets/Lottie-Animations";

export const ListofOrders = ({
  farmName,
  setFarmName,
  orders,
  fetchOrders,
  fetchNotification,
  checkedItems,
  setCheckedItems,
  isLoading,
}) => {
  const [editData, setEditData] = useState({
    transactId: "",
    farm: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    quantiy: "",
  });
  const [cancelId, setCancelId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [disableIfStock, setDisableIfStock] = useState(false);
  const [transactId, setTransactId] = useState("");

  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const {
    isOpen: isSchedule,
    onOpen: openSchedule,
    onClose: closeSchedule,
  } = useDisclosure();

  const orderCategories = orders?.map((item) => {
    return {
      category: item.category,
    };
  });
  const filteredCategories = [
    ...new Set(orderCategories?.map((item) => item.category)),
  ];
  const sortedCategories = [...filteredCategories].sort((a, b) =>
    a.category > b.category ? 1 : -1
  );

  // Buton disable for out of stock and backdated date needed
  useEffect(() => {
    orders?.map((item) => {
      setTransactId(item.id);
      // || item.days < 0
      if (item.stockOnHand < item.allocatedQuantity) {
        setDisableIfStock(true);
      } else {
        setDisableIfStock(false);
      }
    });
  }, [orders]);

  const stockAvailable = orders?.filter(
    (item) => item.stockOnHand >= item.quantityOrder
  );
  const filteredStockAvailable = stockAvailable?.filter((item) => {
    if (keyword) {
      return item.category === keyword;
    } else {
      return stockAvailable;
    }
  });
  const stockData = filteredStockAvailable?.map((item) => item.id);
  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(stockData);
    } else {
      setCheckedItems([]);
    }
  };

  const childCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, parseInt(e.target.value)]);
    } else {
      const data = checkedItems?.filter(
        (item) => item !== parseInt(e.target.value)
      );
      setCheckedItems(data);
    }
  };

  const scheduleHandler = () => {
    openSchedule();
  };

  const editHandler = ({
    id,
    farm,
    itemCode,
    itemDescription,
    uom,
    quantityOrder,
  }) => {
    if (id && farm && itemCode && itemDescription && uom && quantityOrder) {
      setEditData({
        transactId: id,
        farm: farm,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        quantiy: quantityOrder,
      });
      openEdit();
    } else {
      setEditData({
        transactId: "",
        farm: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        quantiy: "",
      });
    }
  };

  const cancelHandler = () => {
    // console.log(id);
    if (checkedItems?.length > 0) {
      // setCancelId(id);
      openCancel();
    }
  };

  return (
    <Flex w="full" px={7} flexDirection="column">
      <HStack w="25%" my={2} mt={5}>
        <Badge bgColor="secondary" color="white" px={3}>
          Category:{" "}
        </Badge>
        <Select
          placeholder="Select a Category"
          onChange={(e) => {
            setKeyword(e.target.value);
            setCheckedItems([]);
          }}
        >
          {sortedCategories?.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </Select>
      </HStack>

      <VStack w="full" spacing={0} justifyContent="center">
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="md"
          bgColor="secondary"
          color="white"
          textAlign="center"
        >
          {`List of Orders (${farmName && farmName})`}
        </Text>
        {orders?.length === 0 ? (
          <NoDataFound text="No remaining orders for scheduling on this customer" />
        ) : (
          <PageScrollReusable minHeight="150px" maxHeight="265px">
            <Table size="sm" variant="simple">
              <Thead bgColor="secondary" top={0} position="sticky" zIndex="1">
                <Tr>
                  <Th>
                    <Checkbox
                      onChange={parentCheckHandler}
                      isChecked={stockData?.length === checkedItems?.length}
                      disabled={!stockData?.length > 0}
                      color="white"
                    >
                      Line
                    </Checkbox>
                  </Th>
                  <Th color="white">ID</Th>
                  <Th color="white">Order Date</Th>
                  <Th color="white">Date Needed</Th>
                  {/* <Th color="white">Customer Code</Th>
                <Th color="white">Customer Name</Th> */}
                  <Th color="white">Category</Th>
                  <Th color="white">Item Code</Th>
                  <Th color="white">Item Description</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Quantity Order</Th>
                  {/* <Th color='white'>Allocated Quantity</Th> */}
                  <Th color="white">Reserve</Th>
                  <Th color="white">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders
                  ?.filter((val) => {
                    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                    return val.category?.toLowerCase().match(newKeyword, "*");
                  })
                  ?.map((item, i) => (
                    <Tr
                      bgColor={
                        item.stockOnHand < item.quantityOrder
                          ? "#dfdfdf5c"
                          : "none"
                      }
                      color={
                        item.stockOnHand < item.quantityOrder ? "black" : "none"
                      }
                      _active={
                        transactId
                          ? { bgColor: "accent", color: "white" }
                          : { bgColor: "none" }
                      }
                      _hover={
                        transactId
                          ? { bgColor: "accent", color: "white" }
                          : { bgColor: "none" }
                      }
                      cursor="pointer"
                      key={i}
                    >
                      {item.stockOnHand >= item.quantityOrder ? (
                        <Td>
                          <Checkbox
                            onChange={childCheckHandler}
                            isChecked={checkedItems.includes(item.id)}
                            value={item.id}
                            color="black"
                          >
                            {i + 1}
                          </Checkbox>
                        </Td>
                      ) : (
                        <Td>
                          <HStack>
                            <TiInfo
                              fontSize="22px"
                              color="red"
                              title="Not enough stocks"
                            />
                            <Text>{i + 1}</Text>
                          </HStack>
                        </Td>
                      )}
                      <Td>{item.id}</Td>
                      <Td>{item.orderDate}</Td>
                      <Td>{item.dateNeeded}</Td>
                      {/* <Td>{item.farmCode}</Td>
                    <Td>{item.farm}</Td> */}
                      <Td>{item.category.toUpperCase()}</Td>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.uom}</Td>
                      <Td>
                        {item.quantityOrder?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      {/* <Td>{item.allocatedQuantity?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td> */}
                      <Td>{item.stockOnHand}</Td>
                      {item?.stockOnHand === 0 ? (
                        <Td>
                          <Button
                            onClick={() => {
                              setCheckedItems([item.id]);
                              openCancel();
                            }}
                            size="xs"
                            colorScheme="red"
                          >
                            Cancel
                          </Button>
                        </Td>
                      ) : (
                        <Td>
                          <Button
                            onClick={() => editHandler(item)}
                            disabled={item.stockOnHand === 0}
                            size="xs"
                            colorScheme="yellow"
                            color="white"
                            px={4}
                          >
                            Edit
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </PageScrollReusable>
        )}
        <Flex
          w="full"
          justifyContent="space-between"
          py={2}
          px={2}
          display={orders?.length === 0 ? "none" : "flex"}
        >
          <Text fontSize="xs">Selected Item(s): {checkedItems?.length}</Text>
          <Flex gap={2}>
            <Button
              onClick={scheduleHandler}
              title={
                !checkedItems?.length > 0
                  ? disableIfStock
                    ? "Stocks must be available"
                    : "Please select an order to schedule"
                  : !checkedItems?.length > 0 || disableIfStock
                  ? "Stocks must be available"
                  : "Schedule order(s)"
              }
              disabled={!checkedItems?.length > 0 || disableIfStock}
              size="sm"
              px={3}
              colorScheme="blue"
            >
              Schedule
            </Button>
            <Button
              onClick={cancelHandler}
              disabled={checkedItems?.length === 0}
              size="sm"
              px={3}
              colorScheme="red"
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </VStack>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          // setCurrentPage={setCurrentPage}
          // currentPage={currentPage}
          fetchOrders={fetchOrders}
        />
      )}

      {isCancel && (
        <CancelModalConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          cancelId={cancelId}
          // setCurrentPage={setCurrentPage}
          // currentPage={currentPage}
          fetchOrders={fetchOrders}
          fetchNotification={fetchNotification}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
      )}

      {isSchedule && (
        <ScheduleConfirmation
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          isOpen={isSchedule}
          onClose={closeSchedule}
          farmName={farmName}
          fetchOrders={fetchOrders}
          // setCurrentPage={setCurrentPage}
          // currentPage={currentPage}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
