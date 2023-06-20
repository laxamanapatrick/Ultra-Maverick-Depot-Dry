import {
  Flex,
  Box,
  Image,
  Text,
  HStack,
  Badge,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import apiClient from "../services/apiClient";
import { decodeUser } from "../services/decode-user";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";
import moment from "moment";
import PageScrollReusable from "./PageScroll-Reusable";

const currentUser = decodeUser();

const fetchTagModuleApi = async () => {
  const currentSelectedRole = currentUser?.role;
  const res = await apiClient.get(
    `Role/GetRoleModuleWithId/${currentSelectedRole}`
  );
  return res.data;
};

const SidebarHeader = () => {
  return <Flex bgColor="primary" h="50px"></Flex>;
};

const SidebarFooter = () => {
  const navigate = useNavigate();
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      pb="3"
    >
      <Image
        src="/images/logo.svg"
        w="120px"
        // onClick={currentUser?.role === 1 ? () => navigate("/sandbox") : null}
      ></Image>
      <Text color="white" fontSize="xs" textAlign="center">{`© ${moment(
        new Date()
      ).format(
        "YYYY"
      )}, Ultra Maverick Dry Powered by System Developer Unit (MIS)`}</Text>
      {/* <Text color="white" fontSize="xs" textAlign="center">
        © {moment(new Date()).format("YYYY")} Ultra Maverick Dry Powered <br />{" "}
        by System and Application Development (MIS)
      </Text> */}
    </Flex>
  );
};

export const NewSidebar = ({
  notification,
  fetchNotification,
  sideBarHandler,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [tagModules, setTagModules] = useState([]);
  // const { setSelectedMenu } = useContext(Context);
  const [currentPath, setCurrentPath] = useState("");
  const [subData, setSubData] = useState([]);

  const fetchTagged = () => {
    fetchTagModuleApi(tagModules).then((res) => {
      const unique = [];
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.mainMenuId)) {
          map.set(item.mainMenuId, true);
          const submenu = res.filter(
            (s) =>
              s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu
          );
          unique.push({
            mainMenuId: item.mainMenuId,
            mainMenu: item.mainMenu,
            path: item.menuPath,
            subMenu: submenu.map((sub) => {
              return {
                title: sub.subMenu,
                path: sub.moduleName,
              };
            }),
          });
        }
      }
      setTagModules(unique);
    });
  };

  useEffect(() => {
    fetchTagged();

    return () => {
      setTagModules([]);
    };
  }, []);

  const mainHandler = (children, title) => {
    fetchNotification();
    setSubData(children);
    // setSelectedModule(title)
  };

  const navBars = [
    {
      title: "QC Receiving",
      notifcation: notification?.qcReceiving?.posummarycount,
    },
    {
      title: "Warehouse Receiving",
      notifcation: notification?.warehouseReceiving?.warehousecount,
    },
    {
      title: "Raw Materials Nearly Expire",
      notifcation: notification?.nearlyExpire?.nearexpirecount,
    },
    {
      title: "Cancelled PO",
      notifcation: notification?.cancelledPO?.cancelledpocount,
    },
    {
      title: "Approval/Rejection Warehouse",
      notifcation: notification?.approvalRejectWarehouse?.approvalrejectcount,
    },
    {
      title: "Warehouse Confirm Reject",
      notifcation: notification?.confirmReject?.confirmrejectcount,
    },
    {
      title: "Approval Request",
      notifcation: notification?.approvalRequest?.approvalrequestcount,
    },
    {
      title: "Preparation",
      notifcation: notification?.preparation?.preparationcount,
    },
    {
      title: "Mixing",
      notifcation: notification?.mixing?.mixingcount,
    },
    {
      title: "Preparation Schedule",
      notifcation: notification?.orderingFarm?.orderingfarmcount,
    },
    {
      title: "Allocation",
      notifcation: notification?.allocation?.forallocationcount,
    },
    {
      title: "Approval",
      notifcation: notification?.orderingApproval?.orderingapprovalcount,
    },
    {
      title: "Move Order",
      notifcation: notification?.moveOrderList?.moveordercount,
    },
    {
      title: "Transact Move Order",
      notifcation: notification?.transactMoveOrderList?.transactmoveordercount,
    },
    {
      title: "For Approval MO",
      notifcation: notification?.forApprovalMoveOrder?.forapprovallistcount,
    },
    {
      title: "Rejected MO",
      notifcation: notification?.rejectMoveOrder?.rejectlistcount,
    },
  ];

  // useEffect(() => {
  //   if (!subData?.some((x) => x.path === pathname) && pathname !== "/") {
  //     navigate("/access-denied");
  //   }
  // }, [pathname]);

  return (
    <>
      <Flex
        h="full"
        boxShadow="0px 3px 10px 0px rgba(40,40,43,1)"
        flexDirection="column"
        bgColor="primary"
        justifyContent="space-between"
      >
        <VStack>
          <SidebarHeader />
          <PageScrollReusable minHeight="auto" maxHeight="600px">
            <Accordion allowToggle w="full">
              {tagModules?.map((sidebarMenu) => (
                <AccordionItem
                  key={sidebarMenu.path}
                  border="none"
                  boxShadow={
                    pathname.includes(sidebarMenu.path)
                      ? "0px 3px 10px 0px rgba(40,40,43,1)"
                      : "none"
                  }
                  bgColor={pathname.includes(sidebarMenu.path) ? "accent" : ""}
                  fontWeight="semibold"
                >
                  <AccordionButton
                    onClick={() =>
                      mainHandler(sidebarMenu.subMenu, sidebarMenu.title)
                    }
                    w="full"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="semibold" textAlign="start" color="white">
                      {sidebarMenu.mainMenu}
                    </Text>
                    <AccordionIcon
                      color={
                        pathname.includes(sidebarMenu.path)
                          ? "#28282B"
                          : "#e5e5e5"
                      }
                    />
                  </AccordionButton>
                  <AccordionPanel
                    boxShadow={
                      pathname.includes(sidebarMenu.path)
                        ? "0px 3px 10px 0px rgba(40,40,43,1)"
                        : "none"
                    }
                    bgColor="secondary"
                    p={4}
                  >
                    <PageScrollReusable minHeight="auto" maxHeight="200px">
                      {subData?.map((sub, i) => (
                        <Link
                          to={sub.path}
                          key={sub.path}
                          onClick={() => setCurrentPath(sub.path)}
                        >
                          <HStack
                            justifyContent="space-between"
                            w="97%"
                            cursor="pointer"
                            // onClick={sideBarHandler}
                            p={1}
                            m={1}
                            fontSize="sm"
                            textAlign="center"
                            color={
                              pathname.includes(sub.path) ? "black" : "white"
                            }
                            bgColor={
                              pathname.includes(sub.path) ? "accent" : "none"
                            }
                            // border="1px"
                            // borderStyle={
                            //   pathname.includes(sub.path) ? "groove" : "dashed"
                            // }
                            _hover={{
                              borderStyle: "groove",
                              boxShadow: "0px 3px 10px 0px rgba(40,40,43,1)",
                              bgColor: "accent",
                              color: "myBlack",
                            }}
                          >
                            <Text>{sub.title}</Text>
                            {navBars.map((nav, i) =>
                              !pathname.includes(sub.path)
                                ? sub.title === nav.title && (
                                    <Badge key={i} bgColor="danger">
                                      <Text color="white">
                                        {nav.notifcation === 0
                                          ? ""
                                          : nav.notifcation}
                                      </Text>
                                    </Badge>
                                  )
                                : ""
                            )}
                          </HStack>
                        </Link>
                      ))}
                    </PageScrollReusable>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </PageScrollReusable>
        </VStack>
        <SidebarFooter />
      </Flex>
    </>
  );
};

// const OldSidebar = ({ notification, fetchNotification }) => {
//     const { pathname } = useLocation();
//     const [tagModules, setTagModules] = useState([]);
//     const { setSelectedMenu } = useContext(Context);

//     const fetchTagged = () => {
//       fetchTagModuleApi(tagModules).then((res) => {
//         const unique = [];
//         const map = new Map();
//         for (const item of res) {
//           if (!map.has(item.mainMenuId)) {
//             map.set(item.mainMenuId, true);
//             const submenu = res.filter(
//               (s) =>
//                 s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu
//             );
//             unique.push({
//               mainMenuId: item.mainMenuId,
//               mainMenu: item.mainMenu,
//               path: item.menuPath,
//               subMenu: submenu.map((sub) => {
//                 return {
//                   title: sub.subMenu,
//                   path: sub.moduleName,
//                 };
//               }),
//             });
//           }
//         }
//         setTagModules(unique);
//       });
//     };

//     useEffect(() => {
//       fetchTagged();

//       return () => {
//         setTagModules([]);
//       };
//     }, []);

//     const selectedMenuHandler = (data) => {
//       setSelectedMenu(data);
//     };

//     const sideBars = [
//       {
//         title: "MO Approval",
//         notifcation: notification?.forApprovalMoveOrder?.forapprovallistcount,
//       },
//       {
//         title: "Ordering",
//         notifcation: notification?.orderingApproval?.orderingapprovalcount,
//       },
//       {
//         title: "Inventory",
//         notifcation: notification?.moveOrderList?.moveordercount,
//       },
//     ];

//     return (
//       <Flex
//         h="100vh"
//         flexDirection="column"
//         justifyContent="space-between"
//         bgColor="secondary"
//         width="15rem"
//         borderColor="primary"
//         borderRight="1px"
//       >
//         <Flex flexDirection="column">
//           <SidebarHeader />
//           {tagModules?.map((modName) => (
//             <Link to={modName.path} key={modName.mainMenuId}>
//               <Box
//                 onClick={() => selectedMenuHandler(modName)}
//                 bgColor={pathname.includes(modName.path) ? "accent" : "secondary"}
//                 p={2}
//                 borderBottom="1px"
//                 borderColor="primary"
//                 cursor="pointer"
//                 _hover={{ bgGradient: "linear(to-l, #003366, accent)" }}
//                 bgGradient={
//                   pathname.includes(modName.path)
//                     ? "linear(to-l, accent, #003366)"
//                     : "secondary"
//                 }
//               >
//                 <HStack justifyContent="space-between">
//                   <Text color="white">{modName.mainMenu}</Text>
//                   {sideBars.map((side, i) =>
//                     !pathname.includes(modName.path)
//                       ? modName.mainMenu === side.title && (
//                           <Badge key={i} background="none">
//                             {side.notifcation === 0 ? (
//                               ""
//                             ) : (
//                               <MdOutlineNotificationsActive
//                                 fontSize="18px"
//                                 // color='#87CEAA'
//                                 color="#f56565"
//                               />
//                             )}
//                           </Badge>
//                         )
//                       : ""
//                   )}
//                   <HiOutlineArrowCircleRight
//                     hidden={!pathname.includes(modName.path) ? "6px 3px 3px" : ""}
//                     color="white"
//                   />
//                 </HStack>
//               </Box>
//             </Link>
//           ))}
//         </Flex>
//         <SidebarFooter />
//       </Flex>
//     );
//   };

//   export default OldSidebar;
