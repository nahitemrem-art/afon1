import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfoliosApi } from '../api';

export const usePortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: portfoliosApi.getAll,
  });
};

export const usePortfolio = (id: string) => {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfoliosApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => portfoliosApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useAddHolding = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      portfolioId,
      fundId,
      shares,
      purchasePrice,
    }: {
      portfolioId: string;
      fundId: string;
      shares: number;
      purchasePrice: number;
    }) => portfoliosApi.addHolding(portfolioId, fundId, shares, purchasePrice),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};
