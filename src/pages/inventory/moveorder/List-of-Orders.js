import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { MdOutlinePendingActions } from "react-icons/md";
import { GoArrowSmallRight } from "react-icons/go";
import { BsCheck2Circle } from "react-icons/bs";
import PageScrollReusable from "../../../components/PageScroll-Reusable";
import moment from "moment";
import { RiQuestionnaireLine } from "react-icons/ri";

export const ListofOrders = ({
  orderListData,
  setItemCode,
  highlighterId,
  setHighlighterId,
  setQtyOrdered,
  setPreparedQty,
  orderId,
  setWarehouseId,
  setPageDisable,
  preparedData,
  preparingStatus,
}) => {
  const TableHead = [
    "Line",
    "Order Date",
    "Date Needed",
    "Customer Code",
    "Customer Name",
    "Category",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity Order",
    "Prepared Qty",
    "Status",
  ];

  const orderCategories = orderListData?.map((item) => {
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

  const [keyword, setKeyword] = useState("");

  const rowHandler = ({
    id,
    itemCode,
    quantityOrder,
    preparedQuantity,
  }) => {
    setWarehouseId("");
    if (id && itemCode) {
      setItemCode(itemCode);
      setHighlighterId(id);
      setQtyOrdered(quantityOrder);
      setPreparedQty(preparedQuantity);
    } else {
      setItemCode("");
      setHighlighterId("");
      setQtyOrdered("");
      setPreparedQty("");
    }
    // if (quantityOrder === preparedQuantity) {
    //   setPageDisable(true);
    // } else {
    //   setPageDisable(false);
    // }
  };

  useEffect(() => {
    if (preparingStatus) {
      setPageDisable(false);
    } else {
      const validate = orderListData.some(
        (item) => item.quantityOrder === item.preparedQuantity
      );
      setPageDisable(validate);
    }
  }, [preparedData, orderListData]);

  //   orderListData, ...orderListData?.map(item => item.quantityOrder), ...orderListData?.map(item => item.preparedQuantity)

  return (
    <VStack w="full" spacing={0} justifyContent="center" mt={10}>
      <HStack w="full" justifyContent="start" mb={1}>
        <Badge bgColor="secondary" color="white" px={3}>
          Category:{" "}
        </Badge>
        <Select
          w="auto"
          placeholder="Select a Category"
          onChange={(e) => setKeyword(e.target.value)}
        >
          {sortedCategories?.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </Select>
      </HStack>
      <Text
        w="full"
        fontWeight="semibold"
        fontSize="md"
        bgColor="secondary"
        color="white"
        textAlign="center"
      >
        List of Orders
      </Text>
      <PageScrollReusable minHeight="150px" maxHeight="200px">
        <Table size="sm" variant="simple">
          <Thead bgColor="secondary">
            <Tr>
              {TableHead?.map((head, i) => (
                <Th key={i} color="white">
                  {head}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {orderListData
              ?.filter((val) => {
                const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                return val.category?.toLowerCase().match(newKeyword, "*");
              })
              ?.map((list, i) => (
                <Tr
                  key={i}
                  onClick={() => rowHandler(list)}
                  bgColor={highlighterId === list.id ? "table_accent" : "none"}
                  cursor="pointer"
                >
                  {highlighterId === list.id ? (
                    <Td>
                      <GoArrowSmallRight fontSize="27px" />
                    </Td>
                  ) : (
                    <Td>{i + 1}</Td>
                  )}
                  <Td>{moment(list.orderDate).format("yyyy-MM-DD")}</Td>
                  <Td>{moment(list.dateNeeded).format("yyyy-MM-DD")}</Td>
                  <Td>{list.farmCode}</Td>
                  <Td>{list.farm}</Td>
                  <Td>{list.category}</Td>
                  <Td>{list.itemCode}</Td>
                  <Td>{list.itemDescription}</Td>
                  <Td>{list.uom}</Td>
                  <Td>{list.quantityOrder}</Td>
                  <Td>{list.preparedQuantity}</Td>
                  <Td>
                    {list.quantityOrder <= list.preparedQuantity ? (
                      <BsCheck2Circle fontSize="20px" title="Done" />
                    ) : (
                      <MdOutlinePendingActions
                        fontSize="20px"
                        title="Pending"
                      />
                    )}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </PageScrollReusable>
    </VStack>
  );
};
