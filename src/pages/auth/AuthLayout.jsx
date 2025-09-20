import { Box, Image, Center, Flex } from "@mantine/core";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Box display={"flex"} p="sm" m={0} h="100vh">
      <Box w={{ base: "0", md: "50%" }}>
        <Center h="100%">
          <Image
            height="20%"
            width="20%"
            fit="contain"
            src="/src/assets/react.svg"
            alt="logo"
          />
        </Center>
      </Box>
      <Flex
        w={{ base: "100%", md: "50%" }}
        justify="center"
        align={{ base: "center" }}
        h="100%"
        direction="column"
      >
        <Box w={{ base: "100%", sm: "75%", md: "50%" }}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
}
