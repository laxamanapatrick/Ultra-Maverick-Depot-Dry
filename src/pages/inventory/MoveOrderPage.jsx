import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ActualItemQuantity } from "./moveorder/Actual-Item-Quantity";
import { ListofApprovedDate } from "./moveorder/List-of-Approved-Date";
import { ListofOrders } from "./moveorder/List-of-Orders";
import { PreparedItems } from "./moveorder/Prepared-Items";
import { usePagination } from "@ajna/pagination";
import apiClient from "../../services/apiClient";
import { SaveButton } from "./moveorder/Action-Modals";
import { ToastComponent } from "../../components/Toast";
import { hubURL } from "../../services/hubURL";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { decodeUser } from "../../services/decode-user";
import {
  DisablePreparation,
  EnablePreparation,
} from "./moveorder/Preparation-User-Control";

const currentUser = decodeUser();

//Pagination

const fetchMoveOrderApi = async (pageNumber) => {
  const res = await apiClient.get(
    `Ordering/GetAllListForMoveOrderPagination?pageSize=1&pageNumber=${pageNumber}`
  );
  return res.data;
};

//List of Approved Move Orders

const fetchApprovedMoveOrdersApi = async (farmName) => {
  const res = await apiClient.get(
    `Ordering/GetAllListOfApprovedPreparedForMoveOrder?farm=${farmName}`
  );
  return res.data;
};

//List of Orders

const fetchOrderListApi = async (orderId) => {
  const res = await apiClient.get(
    `Ordering/GetAllListOfOrdersForMoveOrder?id=${orderId}`
  );
  return res.data;
};

//Actual Item Quantity || Barcode Details

const fetchBarcodeDetailsApi = async (warehouseId, itemCode) => {
  const res = await apiClient.get(
    `Ordering/GetAvailableStockFromWarehouse?id=${warehouseId}&itemcode=${itemCode}`
  );
  return res.data;
};

//Prepared Items

const fetchPreparedItemsApi = async (orderId) => {
  const res = await apiClient.get(
    `Ordering/ListOfPreparedItemsForMoveOrder?id=${orderId}`
  );
  return res.data;
};

const MoveOrderPage = ({
  notification,
  fetchNotification,
  unsetRequest,
  setMoveOrderIdOnApp,
}) => {
  const [farmName, setFarmName] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState("");
  // const [batchNumber, setBatchNumber] = useState('')

  const [moveData, setMoveData] = useState([]);
  const [lengthIndicator, setLengthIndicator] = useState("");

  const [orderId, setOrderId] = useState("");
  const [orderListData, setOrderListData] = useState([]);

  const [highlighterId, setHighlighterId] = useState("");

  const [qtyOrdered, setQtyOrdered] = useState("");
  const [preparedQty, setPreparedQty] = useState("");

  const [warehouseId, setWarehouseId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);
  const [nearlyExpireBarcode, setNearlyExpireBarcode] = useState("");

  const [preparedData, setPreparedData] = useState([]);

  let [buttonChanger, setButtonChanger] = useState(false);

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

  const [pageDisable, setPageDisable] = useState(false);

  const [preparingStatus, setPreparingStatus] = useState(false);
  const [isBeingPrepared, setIsBeingPrepared] = useState(false);
  const [preparingUser, setPreparingUser] = useState("");
  // const [paginationData, setPaginationData] = useState([]);
  const [connectionTwo, setConnectionTwo] = useState(null);

  //Pagination

  const fetchMoveOrder = () => {
    fetchMoveOrderApi(currentPage).then((res) => {
      setFarmName(res?.orders[0]?.farm);
      setPageTotal(res.totalCount);
      // setPaginationData(res);
    });
  };

  useEffect(() => {
    if (currentPage) {
      fetchMoveOrder();
    }

    return () => {
      setFarmName("");
    };
  }, [currentPage]);

  //Approved Move Orders

  const fetchApprovedMoveOrders = () => {
    fetchApprovedMoveOrdersApi(farmName).then((res) => {
      setMoveData(res);
      setMoveOrderIdOnApp(res[0]?.id);
      setLengthIndicator(res.length);
      // setOrderId(res[0]?.id)
    });
  };

  useEffect(() => {
    if (farmName) {
      fetchApprovedMoveOrders();
    }

    return () => {
      setMoveData([]);
    };
  }, [farmName]);

  //List of Orders

  const fetchOrderList = () => {
    fetchOrderListApi(orderId).then((res) => {
      setIsBeingPrepared(
        res[lengthIndicator && lengthIndicator - 1]?.isBeingPrepared
      );
      setPreparingUser(res[lengthIndicator && lengthIndicator - 1]?.setBy);
      setOrderListData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderList();
    }

    return () => {
      setOrderListData([]);
    };
  }, [orderId]);

  //Barcode Details
  const toast = useToast();
  const fetchBarcodeDetails = () => {
    fetchBarcodeDetailsApi(warehouseId, itemCode)
      .then((res) => {
        setBarcodeData(res);
        setNearlyExpireBarcode(res?.warehouseId);
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
  };

  useEffect(() => {
    if (warehouseId && itemCode) {
      fetchBarcodeDetails();
    }

    return () => {
      setBarcodeData([]);
    };
  }, [warehouseId, itemCode]);

  //Prepared Items

  const fetchPreparedItems = () => {
    fetchPreparedItemsApi(orderId).then((res) => {
      setPreparedData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchPreparedItems();
    }

    return () => {
      setPreparedData([]);
    };
  }, [orderId]);

  //UseEffect for button change Add-Save
  useEffect(() => {
    if (orderListData.length > 0) {
      const variable = orderListData.every(
        (item) => item.preparedQuantity === item.quantityOrder
      );
      setButtonChanger(variable);
      // orderListData.some(item => {
      //   if (item.preparedQuantity !== item.quantityOrder) {
      //     setButtonChanger(false)
      //   }
      // })
    }
  }, [orderListData]);

  //Realtime Preparing - Hub of Setting Request

  const startSetConnection = async () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(hubURL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    await hubConnection.start();
    setConnectionTwo(hubConnection);
  };

  useEffect(() => {
    startSetConnection();
  }, []);

  useEffect(() => {
    if (connectionTwo) {
      connectionTwo.on("SetBeingPrepared", (res) => {
        // console.log(res);
      });
    }
  }, [connectionTwo]);

  const setRequest = () => {
    startSetConnection();
    apiClient.post("Ordering/SetBeingPrepared", [
      {
        orderNoPKey: moveData[0]?.id,
        isBeingPrepared: true,
        setBy: currentUser?.fullName,
      },
    ]);
  };

  useEffect(() => {
    startSetConnection();
    unsetRequest(moveData[0]?.id, currentUser?.fullName);
    setPreparingStatus(false);
  }, [currentPage]);

  return (
    <>
      {isBeingPrepared && preparingUser !== currentUser?.fullName && (
        <DisablePreparation preparingUser={preparingUser} />
      )}
      {!preparingStatus && !isBeingPrepared && !preparingUser && (
        <EnablePreparation preparingUser={preparingUser} />
      )}
      <VStack w="full" p={4} spacing={6}>
        <ListofApprovedDate
          preparingUser={preparingUser}
          me={currentUser?.fullName}
          isBeingPrepared={isBeingPrepared}
          preparingStatus={preparingStatus}
          setPreparingStatus={setPreparingStatus}
          setRequest={setRequest}
          unsetRequest={unsetRequest}
          startSetConnection={startSetConnection}
          connectionTwo={connectionTwo}
          MoveOrderId={moveData[0]?.id}
          userFullname={currentUser?.fullName}
          farmName={farmName}
          moveData={moveData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          setOrderId={setOrderId}
          orderId={orderId}
          setItemCode={setItemCode}
          setWarehouseId={setWarehouseId}
          setHighlighterId={setHighlighterId}
          setDeliveryStatus={setDeliveryStatus}
          // setBatchNumber={setBatchNumber}
          buttonChanger={buttonChanger}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchMoveOrder={fetchMoveOrder}
          fetchOrderList={fetchOrderList}
          lengthIndicator={lengthIndicator}
          preparedLength={preparedData?.length}
          pageDisable={pageDisable}
        />
        {orderId ? (
          <ListofOrders
            orderListData={orderListData}
            setItemCode={setItemCode}
            highlighterId={highlighterId}
            setHighlighterId={setHighlighterId}
            setQtyOrdered={setQtyOrdered}
            setPreparedQty={setPreparedQty}
            setWarehouseId={setWarehouseId}
            setPageDisable={setPageDisable}
            preparedData={preparedData}
            preparingStatus={preparingStatus}
          />
        ) : (
          ""
        )}
        {buttonChanger ? (
          <SaveButton
            deliveryStatus={deliveryStatus}
            // batchNumber={batchNumber}
            orderListData={orderListData}
            fetchApprovedMoveOrders={fetchApprovedMoveOrders}
            fetchOrderList={fetchOrderList}
            setOrderId={setOrderId}
            setHighlighterId={setHighlighterId}
            setItemCode={setItemCode}
            setDeliveryStatus={setDeliveryStatus}
            setButtonChanger={setButtonChanger}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            fetchNotification={fetchNotification}
            unsetRequest={unsetRequest}
            userId={currentUser?.id}
            unsetOrderId={moveData[0]?.id}
            setPageDisable={setPageDisable}
          />
        ) : (
          itemCode &&
          highlighterId && (
            <ActualItemQuantity
              setWarehouseId={setWarehouseId}
              warehouseId={warehouseId}
              barcodeData={barcodeData}
              orderId={orderId}
              highlighterId={highlighterId}
              itemCode={itemCode}
              fetchOrderList={fetchOrderList}
              fetchPreparedItems={fetchPreparedItems}
              qtyOrdered={qtyOrdered}
              preparedQty={preparedQty}
              setHighlighterId={setHighlighterId}
              setItemCode={setItemCode}
              nearlyExpireBarcode={nearlyExpireBarcode}
              setPageDisable={setPageDisable}
            />
          )
        )}
        {preparedData.length > 0 && (
          <PreparedItems
            preparedData={preparedData}
            fetchPreparedItems={fetchPreparedItems}
            fetchOrderList={fetchOrderList}
          />
        )}
      </VStack>
    </>
  );
};

export default MoveOrderPage;
