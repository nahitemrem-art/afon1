import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Center,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useFavorites, useRemoveFavorite } from '../hooks';
import { FundCard } from '../components';

export const FavoritesPage = () => {
  const { data: favorites, isLoading } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  const toast = useToast();

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFavorite.mutateAsync(id);
      toast({
        title: 'Removed from favorites',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error removing favorite',
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
      <Heading mb={6}>My Favorites</Heading>

      {favorites && favorites.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {favorites.map((favorite) => (
            <Box key={favorite.id} position="relative">
              <FundCard fund={favorite.fund} />
              <IconButton
                aria-label="Remove from favorites"
                icon={<FiTrash2 />}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleRemoveFavorite(favorite.id)}
              />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center h="40vh">
          <Text color="gray.600">No favorites yet</Text>
        </Center>
      )}
    </Box>
  );
};
