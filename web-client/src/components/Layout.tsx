import { Box, Container, Flex, Heading, Link as ChakraLink, HStack } from '@chakra-ui/react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="brand.600">
              Fund Manager
            </Heading>
            <HStack spacing={6}>
              <ChakraLink
                as={RouterLink}
                to="/"
                fontWeight={isActive('/') ? 'bold' : 'normal'}
                color={isActive('/') ? 'brand.600' : 'gray.600'}
                _hover={{ color: 'brand.500' }}
              >
                Funds
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/compare"
                fontWeight={isActive('/compare') ? 'bold' : 'normal'}
                color={isActive('/compare') ? 'brand.600' : 'gray.600'}
                _hover={{ color: 'brand.500' }}
              >
                Compare
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/portfolios"
                fontWeight={isActive('/portfolios') ? 'bold' : 'normal'}
                color={isActive('/portfolios') ? 'brand.600' : 'gray.600'}
                _hover={{ color: 'brand.500' }}
              >
                Portfolios
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/favorites"
                fontWeight={isActive('/favorites') ? 'bold' : 'normal'}
                color={isActive('/favorites') ? 'brand.600' : 'gray.600'}
                _hover={{ color: 'brand.500' }}
              >
                Favorites
              </ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
};
