import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../../services/decode-user';
import PageScroll from '../../../components/PageScroll';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import { FaSearch } from 'react-icons/fa';

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    farmCode: yup.string().required("Farm Code is required"),
    farmName: yup.string().required("Farm Name is required"),
  })
})

const fetchFarmApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`Customer/GetAllFarmWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const FarmPage = () => {

  const [farms, setFarms] = useState([])
  const [codeDisable, setCodeDisable] = useState(false)

  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined)

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        farmCode: "",
        farmName: "",
        addedBy: currentUser.addedBy
      }
    }
  })

  const fetchFarm = () => {
    fetchFarmApi(currentPage, pageSize, status, search).then(res => {
      setIsLoading(false)
      setFarms(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchFarm()
  }, [currentPage, pageSize, status, search])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, status) => {
    let routeLabel;
    if (status) {
      routeLabel = "InActiveFarm"
    } else {
      routeLabel = "ActivateFarm"
    }

    apiClient.put(`Customer/${routeLabel}/${id}`, { id: id }).then((res) => {
      ToastComponent("Success", "Item Category Updated", "success", toast)
      fetchFarm()
    }).catch(err => {
      console.log(err);
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const editHandler = (farm) => {
    openDrawer();
    setValue("formData", {
      id: farm.id,
      farmCode: farm.farmCode,
      farmName: farm.farmName,
    }, { shouldValidate: true })
    setCodeDisable(true)
  }

  const newFarmHandler = () => {
    setCodeDisable(false)
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w="full" flexDirection="column">

      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Customer Code'
              onChange={(e) => searchHandler(e.target.value)}
              focusBorderColor='accent'
            />
          </InputGroup>
        </HStack>

        <HStack>
          <Text>STATUS: </Text>
          <Select
            onChange={(e) => statusHandler(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
        </HStack>
      </Flex>

      <PageScroll>
        {
          isLoading ? (
            <Stack width="full">
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          ) : (
            <Table variant='striped' size='sm'>
              <Thead>
                <Tr bgColor='secondary'>
                  <Th color='white'>Id</Th>
                  <Th color='white'>Code</Th>
                  <Th color='white'>Customer Type</Th>
                  <Th color='white'>Added By</Th>
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {farms?.farms?.sort((a, b) => b.id - a.id)?.map(farm =>
                  <Tr key={farm.id}>
                    <Td>{farm.id}</Td>
                    <Td>{farm.farmCode}</Td>
                    <Td>{farm.farmName}</Td>
                    <Td>{farm.addedBy}</Td>
                    <Td>{farm.dateAdded}</Td>
                    <Td>

                      <Button p={0} background='none' color='secondary' onClick={() => editHandler(farm)}>
                        <RiEditBoxFill />
                      </Button>

                      <Popover>
                        <PopoverTrigger>
                          <Button p={0} background='none'><GiChoice /></Button>
                        </PopoverTrigger>
                        <Portal>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              <VStack>
                                {farm.isActive === true ? <Text>Are you sure you want to set this category inactive?</Text> : <Text>Are you sure you want to set this farm type active?</Text>}
                                <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} onClick={() => changeStatusHandler(farm.id, farm.isActive)}>Yes</Button>
                              </VStack>
                            </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>

                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>
      <Flex justifyContent='space-between' mt={5}>
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newFarmHandler} _hover={{ bgColor: 'accent' }}>
          <Text color='white'>New Customer</Text>
        </Button>
        {
          isDrawerOpen && (
            <DrawerComponent
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              register={register}
              errors={errors}
              isValid={isValid}
              handleSubmit={handleSubmit}
              fetchFarm={fetchFarm}
              codeDisable={codeDisable}
            />
          )
        }

        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: 'accent', color: 'white' }}
                    p={3}
                    bg="secondary"
                    color='white'
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  variant='filled'
                >
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>

      </Flex>
    </Flex>
  )
}

export default FarmPage

const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchFarm, codeDisable }) => {
  const [isLoading, setisLoading] = useState(false)
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("Customer/AddNewFarm", data.formData).then((res) => {
          ToastComponent("Success", "New farm created", "success", toast)
          setisLoading(false)
          fetchFarm()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } else {
        const res = apiClient.put(`Customer/UpdateFarm/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "Farm Updated", "success", toast)
          setisLoading(false)
          fetchFarm()
          onClose(onClose)
        }).catch(err => {
          ToastComponent("Update Failed", err.response.data, "warning", toast)
        })
      }

    } catch (err) {
    }
  }

  return (
    <Flex>

      <Drawer
        isOpen={isOpen}
        placement='center'
        onClose={onClose}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Customer Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Flex mt={1.5}></Flex>

                <Box>
                  <FormLabel>Customer Code:</FormLabel>
                  <Input
                    disabled={codeDisable}
                    readOnly={codeDisable}
                    _disabled={{ color: 'black' }}
                    bgColor={codeDisable && 'gray.300'}
                    placeholder='Please enter Farm Code'
                    {...register("formData.farmCode")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.farmCode?.message}</Text>
                </Box>

                <Box>
                  <FormLabel>Customer Name:</FormLabel>
                  <Input
                    placeholder='Please enter Farm Name'
                    {...register("formData.farmName")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.farmName?.message}</Text>
                </Box>

              </Stack>

            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                bgColor='secondary'
                color='white'
                _hover={{ bgColor: 'accent' }}
                disabled={!isValid}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </DrawerFooter>

          </DrawerContent>
        </form>
      </Drawer>
    </Flex>


  )
}