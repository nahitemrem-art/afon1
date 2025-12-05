import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { usePortfolios, useCreatePortfolio } from '../hooks';

export const PortfoliosPage = () => {
  const { data: portfolios, isLoading } = usePortfolios();
  const createPortfolio = useCreatePortfolio();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const toast = useToast();

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) {
      toast({
        title: 'Portfolio name required',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await createPortfolio.mutateAsync(newPortfolioName);
      toast({
        title: 'Portfolio created',
        status: 'success',
        duration: 3000,
      });
      setNewPortfolioName('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error creating portfolio',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading>My Portfolios</Heading>
        <Button colorScheme="brand" onClick={onOpen}>
          Create Portfolio
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {portfolios?.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="xl" fontWeight="bold">
                  {portfolio.name}
                </Text>
                <Divider />
                <Stat>
                  <StatLabel>Total Value</StatLabel>
                  <StatNumber>${portfolio.totalValue.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    {portfolio.totalReturnPercentage >= 0 ? (
                      <StatArrow type="increase" />
                    ) : (
                      <StatArrow type="decrease" />
                    )}
                    {Math.abs(portfolio.totalReturnPercentage).toFixed(2)}%
                  </StatHelpText>
                </Stat>
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600">
                      Total Cost
                    </Text>
                    <Text fontWeight="semibold">
                      ${portfolio.totalCost.toLocaleString()}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={0}>
                    <Text fontSize="sm" color="gray.600">
                      Return
                    </Text>
                    <Text
                      fontWeight="semibold"
                      color={portfolio.totalReturn >= 0 ? 'green.500' : 'red.500'}
                    >
                      {portfolio.totalReturn >= 0 ? '+' : ''}$
                      {portfolio.totalReturn.toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {portfolio.holdings.length} holdings
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {portfolios?.length === 0 && (
        <Center h="40vh">
          <VStack spacing={4}>
            <Text color="gray.600">No portfolios yet</Text>
            <Button colorScheme="brand" onClick={onOpen}>
              Create Your First Portfolio
            </Button>
          </VStack>
        </Center>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Portfolio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Portfolio Name</FormLabel>
              <Input
                placeholder="e.g., Retirement Portfolio"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
              />
            </FormControl>
            <HStack justify="flex-end" mt={6}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleCreatePortfolio}
                isLoading={createPortfolio.isPending}
              >
                Create
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
