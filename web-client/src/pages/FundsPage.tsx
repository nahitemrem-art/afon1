import { Box, Heading, SimpleGrid, Spinner, Text, Center } from '@chakra-ui/react';
import { useFunds } from '../hooks';
import { FundCard } from '../components';

export const FundsPage = () => {
  const { data: funds, isLoading, error } = useFunds();

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="50vh">
        <Text color="red.500">Error loading funds</Text>
      </Center>
    );
  }

  return (
    <Box>
      <Heading mb={6}>All Funds</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {funds?.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
