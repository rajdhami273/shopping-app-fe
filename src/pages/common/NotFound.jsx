// ts-strict

import React from "react";
import { useNavigate } from "react-router";

// components
import {
  Container,
  Center,
  Title,
  Text,
  Button,
  Group,
  Paper,
  Box,
} from "@mantine/core";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container size="sm" py={120}>
      <Center>
        <Paper shadow="sm" radius="lg" p={60} withBorder>
          <Center mb={30}>
            <Box
              w={80}
              h={80}
              bg="orange.1"
              radius="50%"
              display="flex"
              c="orange.9"
              fz="2rem"
            >
              <Center w="100%" h="100%">
                ⚠️
              </Center>
            </Box>
          </Center>

          <Box ta="center">
            <Title
              order={1}
              size={120}
              fw={900}
              c="dimmed"
              mb={10}
              lh={1}
              ff="Greycliff CF, sans-serif"
            >
              404
            </Title>

            <Title order={2} size={36} fw={600} mb={15}>
              Page Not Found
            </Title>

            <Text size="lg" c="dimmed" mb={30} maw={400}>
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </Text>

            <Group justify="center">
              <Button size="lg" onClick={handleGoHome} variant="filled">
                🏠 Take me home
              </Button>
            </Group>
          </Box>
        </Paper>
      </Center>
    </Container>
  );
}
