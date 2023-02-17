import React, { useEffect, useState } from "react";
import { usePagination } from "@ajna/pagination";
import apiClient from "../../services/apiClient";
import { ListofforAllocation } from "./allocation/List-of-for-Allocation";

const fetchForAllocationPaginationApi = async (pageNumber) => {
  const res = await apiClient.get(
    `Ordering/GetAllListOfOrdersForAllocationPagination?PageNumber=${pageNumber}&PageSize=1`
  );
  return res.data;
};

const fetchOrdersByItemCodeApi = async (itemCode) => {
  const res = await apiClient.get(
    `Ordering/GetAllListofOrdersForAllocation?itemCode=${itemCode}`
  );
  return res.data;
};

const AllocationPage = ({ fetchNotification }) => {
  const [itemCode, setItemCode] = useState("");
  const [orderData, setOrderData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  });

  const fetchForAllocationPagination = () => {
    fetchForAllocationPaginationApi(currentPage).then((res) => {
      setItemCode(res?.orders[0]?.itemCode);
      setPageTotal(res?.totalCount);
    });
  };

  const fetchOrdersByItemCode = () => {
    fetchOrdersByItemCodeApi(itemCode).then((res) => {
      setOrderData(res);
    });
  };

  useEffect(() => {
    fetchForAllocationPagination();

    return () => {
      setItemCode('')
    };
  }, [currentPage]);

  useEffect(() => {
    if (itemCode) {
      fetchOrdersByItemCode();
    }

    return () => {
      setOrderData([]);
    };
  }, [itemCode]);

  return (
    <>
      <ListofforAllocation
        itemCode={itemCode}
        currentPage={currentPage}
        pagesCount={pagesCount}
        setCurrentPage={setCurrentPage}
        orderData={orderData}
        fetchForAllocationPagination={fetchForAllocationPagination}
        fetchOrdersByItemCode={fetchOrdersByItemCode}
        fetchNotification={fetchNotification}
      />
    </>
  );
};

export default AllocationPage;
