import { Box, Text, Badge, HStack, VStack, IconButton } from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { Fund, FundSummary } from '../types';

interface FundCardProps {
  fund: Fund | FundSummary;
  onFavorite?: (fundId: string) => void;
  isFavorite?: boolean;
}

export const FundCard = ({ fund, onFavorite, isFavorite }: FundCardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'yellow';
      case 'High':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" mb={2}>
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" fontSize="lg">
            {fund.name}
          </Text>
          <Text color="gray.600" fontSize="sm">
            {fund.ticker}
          </Text>
        </VStack>
        {onFavorite && (
          <IconButton
            aria-label="Add to favorites"
            icon={<FiStar />}
            variant={isFavorite ? 'solid' : 'ghost'}
            colorScheme={isFavorite ? 'yellow' : 'gray'}
            onClick={() => onFavorite(fund.id)}
          />
        )}
      </HStack>
      <HStack spacing={2} mb={3}>
        <Badge colorScheme="blue">{fund.category}</Badge>
        <Badge colorScheme={getRiskColor(fund.riskLevel)}>{fund.riskLevel} Risk</Badge>
      </HStack>
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.600">
            YTD Return
          </Text>
          <Text
            fontWeight="semibold"
            color={fund.ytdReturn >= 0 ? 'green.500' : 'red.500'}
          >
            {fund.ytdReturn >= 0 ? '+' : ''}
            {fund.ytdReturn.toFixed(2)}%
          </Text>
        </VStack>
        <VStack align="end" spacing={0}>
          <Text fontSize="xs" color="gray.600">
            Expense Ratio
          </Text>
          <Text fontWeight="semibold">{fund.expenseRatio.toFixed(2)}%</Text>
        </VStack>
      </HStack>
    </Box>
  );
};
