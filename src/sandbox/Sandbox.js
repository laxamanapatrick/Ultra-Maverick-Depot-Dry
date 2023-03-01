import React, { useEffect, useRef, useState } from "react";
import { decodeUser } from "../services/decode-user";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { Button, Flex, Select, Text } from "@chakra-ui/react";
import { hubURL } from "../services/hubURL";
import apiClient from "../services/apiClient";
import { DisablePreparation } from "../pages/inventory/moveorder/Preparation-User-Control";

const currentUser = decodeUser();

export default function Sandbox() {
  const [hubData, setHubData] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const startConnection = async () => {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(hubURL, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .build();

      await hubConnection.start();
      setConnection(hubConnection);
    };
    startConnection();
  }, [hubURL]);

  useEffect(() => {
    if (!connection) {
      return;
    }

    connection.on("BeingPreparedChanged", (res) => {
      setHubData(res);
    });
  }, [connection]);

  const submitTesting = async () => {
    await connection.send("UnsetBeingPrepared", [
      {
        orderNoPKey: 2033,
        isBeingPrepared: null,
        userId: null,
      },
    ]);

    await connection.send("SetBeingPrepared", [
      {
        orderNoPKey: 2033,
        isBeingPrepared: true,
        userId: currentUser?.id,
      },
    ]);

    // Unset
    // apiClient
    //   .post("Ordering/UnsetBeingPrepared", [
    //     {
    //       orderNoPKey: 2033,
    //       isBeingPrepared: null,
    //       userId: null,
    //     },
    //   ])
    //   .then((res) => connection.send(res.data));

    //Set
    // apiClient
    //   .post("Ordering/SetBeingPrepared", [
    //     {
    //       orderNoPKey: 2033,
    //       isBeingPrepared: true,
    //       userId: currentUser?.id,
    //     },
    //   ])
    //   .then((res) => connection.send(res.data));
  };

  const [changer, setChanger] = useState(1);

  return (
    <Flex flexDirection="column" gap={10} w="full" alignItems="center">
      <>
        <Select w="10%" onChange={(e) => setChanger(Number(e.target.value))}>
          <option value={1}>true</option>
          <option value={0}>false</option>
        </Select>
        <Button w="10%" bgColor="black" color="white" onClick={submitTesting}>
          Set
        </Button>
      </>
      {changer === 1 ? (
        <Flex flexDirection="column" gap={10} w="full" alignItems="center">
          <Flex justifyContent="center" border="1px" w="40%">
            <Text>{hubData?.toString()}</Text>
          </Flex>
        </Flex>
      ) : (
        <DisablePreparation />
      )}
    </Flex>
  );
}

// {
//   "pO_Receiving": {
//     "id": 0,
//     "pO_Summary_Id": 0,
//     "manufacturing_Date": "2023-02-27T00:24:28.188Z",
//     "expected_Delivery": 0,
//     "expiry_Date": "2023-02-27T00:24:28.188Z",
//     "actual_Delivered": 0,
//     "itemCode": "string",
//     "batch_No": "string",
//     "totalReject": 0,
//     "isActive": true,
//     "cancelDate": "2023-02-27T00:24:28.188Z",
//     "cancelBy": "string",
//     "reason": "string",
//     "expiryIsApprove": true,
//     "isNearlyExpire": true,
//     "expiryApproveBy": "string",
//     "expiryDateOfApprove": "2023-02-27T00:24:28.188Z",
//     "qC_ReceiveDate": "2023-02-27T00:24:28.188Z",
//     "confirmRejectByQc": true,
//     "isWareHouseReceive": true,
//     "cancelRemarks": "string",
//     "qcBy": "string"
//   },
//   "checklistForCompliants": [
//     {
//       "pO_ReceivingId": 0,
//       "checklist_Type": "string",
//       "value": "string",
//       "isCompliant": true
//     },
//   ],
//   "checklistsString": [
//     {
//       "pO_ReceivingId": 0,
//       "checlist_Type": "string",
//       "value": "string"
//     }
//   ],
//   "checkListInput": [
//     {
//       "pO_ReceivingId": 0,
//       "checlist_Type": "string",
//       "parameter": "string",
//       "value": "string"
//     }
//   ]
// }




