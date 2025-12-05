import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  useToast,
  Checkbox,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useFunds, useCompareFunds } from '../hooks';
import { FundCard } from '../components';

export const ComparePage = () => {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const { data: allFunds } = useFunds();
  const { data: comparedFunds } = useCompareFunds(selectedFunds);
  const toast = useToast();

  const handleToggleFund = (fundId: string) => {
    if (selectedFunds.includes(fundId)) {
      setSelectedFunds(selectedFunds.filter((id) => id !== fundId));
    } else {
      if (selectedFunds.length >= 5) {
        toast({
          title: 'Maximum funds selected',
          description: 'You can compare up to 5 funds at a time',
          status: 'warning',
          duration: 3000,
        });
        return;
      }
      setSelectedFunds([...selectedFunds, fundId]);
    }
  };

  return (
    <Box>
      <Heading mb={6}>Compare Funds</Heading>

      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Select funds to compare (up to 5)
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {allFunds?.map((fund) => (
              <HStack key={fund.id} spacing={3}>
                <Checkbox
                  isChecked={selectedFunds.includes(fund.id)}
                  onChange={() => handleToggleFund(fund.id)}
                  colorScheme="brand"
                />
                <Box flex="1">
                  <FundCard fund={fund} />
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>

        {comparedFunds && comparedFunds.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Comparison
            </Text>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Metric</Th>
                    {comparedFunds.map((fund) => (
                      <Th key={fund.id}>{fund.ticker}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontWeight="semibold">Name</Td>
                    {comparedFunds.map((fund) => (
                      <Td key={fund.id}>{fund.name}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Category</Td>
                    {comparedFunds.map((fund) => (
                      <Td key={fund.id}>{fund.category}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Expense Ratio</Td>
                    {comparedFunds.map((fund) => (
                      <Td key={fund.id}>{fund.expenseRatio.toFixed(2)}%</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">YTD Return</Td>
                    {comparedFunds.map((fund) => (
                      <Td
                        key={fund.id}
                        color={fund.ytdReturn >= 0 ? 'green.500' : 'red.500'}
                      >
                        {fund.ytdReturn >= 0 ? '+' : ''}
                        {fund.ytdReturn.toFixed(2)}%
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">1-Year Return</Td>
                    {comparedFunds.map((fund) => (
                      <Td
                        key={fund.id}
                        color={fund.oneYearReturn >= 0 ? 'green.500' : 'red.500'}
                      >
                        {fund.oneYearReturn >= 0 ? '+' : ''}
                        {fund.oneYearReturn.toFixed(2)}%
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">3-Year Return</Td>
                    {comparedFunds.map((fund) => (
                      <Td
                        key={fund.id}
                        color={fund.threeYearReturn >= 0 ? 'green.500' : 'red.500'}
                      >
                        {fund.threeYearReturn >= 0 ? '+' : ''}
                        {fund.threeYearReturn.toFixed(2)}%
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">5-Year Return</Td>
                    {comparedFunds.map((fund) => (
                      <Td
                        key={fund.id}
                        color={fund.fiveYearReturn >= 0 ? 'green.500' : 'red.500'}
                      >
                        {fund.fiveYearReturn >= 0 ? '+' : ''}
                        {fund.fiveYearReturn.toFixed(2)}%
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Risk Level</Td>
                    {comparedFunds.map((fund) => (
                      <Td key={fund.id}>{fund.riskLevel}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">AUM (M)</Td>
                    {comparedFunds.map((fund) => (
                      <Td key={fund.id}>${fund.aum.toLocaleString()}</Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
