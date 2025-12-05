import { useQuery } from '@tanstack/react-query';
import { fundsApi } from '../api';

export const useFunds = () => {
  return useQuery({
    queryKey: ['funds'],
    queryFn: fundsApi.getAll,
  });
};

export const useFund = (id: string) => {
  return useQuery({
    queryKey: ['fund', id],
    queryFn: () => fundsApi.getById(id),
    enabled: !!id,
  });
};

export const useCompareFunds = (fundIds: string[]) => {
  return useQuery({
    queryKey: ['funds', 'compare', fundIds],
    queryFn: () => fundsApi.compare(fundIds),
    enabled: fundIds.length > 0,
  });
};
