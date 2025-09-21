// ts-strict

import React, { useCallback, useEffect } from "react";
import { Outlet } from "react-router";

// components
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  Stack,
  Button,
  Anchor,
  Flex,
  Badge,
  Avatar,
  Menu,
  UnstyledButton,
} from "@mantine/core";

// hooks
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

// actions
import { logoutUser } from "../../state/actions/userActions";

export default function MainAppLayout() {
  const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] =
    useDisclosure();
  const [asideOpened, { toggle: toggleAside, close: closeAside }] =
    useDisclosure();

  const sidebarLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Orders", href: "/orders" },
    { label: "Customers", href: "/customers" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "/settings" },
  ];

  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    // if user is not logged in, redirect to login
    if (!user) {
      navigate("/auth/login");
    }
    // if user is not verified, redirect to verify
    if (
      user &&
      !user.activeStatus?.isActive &&
      user.activeStatus?.inactiveCode === "USER_NOT_VERIFIED"
    ) {
      navigate("/auth/verify");
    }
    // if user is not active, redirect to login
    if (user && !user.activeStatus?.isActive) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpened, desktop: !navbarOpened },
      }}
      aside={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !asideOpened, desktop: true },
      }}
      footer={{ height: 60 }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={navbarOpened} onClick={toggleNavbar} size="sm" />
            <Text size="lg" fw={600}>
              Shopping
            </Text>
          </Group>

          {/* Right side navigation links - Hidden on small screens */}
          <Group visibleFrom="sm">
            <Button variant="subtle" size="sm">
              Help
            </Button>
            <Badge variant="filled" size="sm">
              Pro
            </Badge>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" src={user?.image} />
                    <Text size="sm" fw={500}>
                      {user?.name || user?.email}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item>Profile</Menu.Item>
                <Menu.Item>Account Settings</Menu.Item>
                <Menu.Item>Billing</Menu.Item>

                <Menu.Divider />

                <Menu.Label>Actions</Menu.Label>
                <Menu.Item>Switch Account</Menu.Item>
                <Menu.Item color="red" onClick={logout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* Mobile-only burger for aside */}
          <Group hiddenFrom="sm">
            <Burger opened={asideOpened} onClick={toggleAside} size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="md" variant="filled">
        <AppShell.Section grow>
          <Stack gap="xs">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                onClick={() => closeNavbar()}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Stack gap="sm">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Support
            </Text>
            <NavLink
              href="/support"
              label="Help Center"
              onClick={() => closeNavbar()}
            />
            <NavLink
              href="/docs"
              label="Documentation"
              onClick={() => closeNavbar()}
            />
            <NavLink
              href="/contact"
              label="Contact Us"
              onClick={() => closeNavbar()}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Aside - User Profile & Account (Mobile Only) */}
      <AppShell.Aside p="md" hiddenFrom="sm">
        <AppShell.Section>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <Avatar size="sm" radius="xl" src={user?.image} />
                <Text size="sm" fw={500}>
                  {user?.name || user?.email}
                </Text>
              </Group>
              <Badge variant="filled" size="xs">
                Pro
              </Badge>
            </Group>

            <Stack gap="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Account
              </Text>
              <NavLink
                href="/profile"
                label="Profile"
                onClick={() => closeAside()}
              />
              <NavLink
                href="/settings"
                label="Account Settings"
                onClick={() => closeAside()}
              />
              <NavLink
                href="/billing"
                label="Billing"
                onClick={() => closeAside()}
              />
            </Stack>

            <Stack gap="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Actions
              </Text>
              <NavLink href="/help" label="Help" onClick={() => closeAside()} />
              <NavLink
                href="/logout"
                label="Logout"
                color="red"
                onClick={() => closeAside()}
              />
            </Stack>
          </Stack>
        </AppShell.Section>
      </AppShell.Aside>

      {/* Footer */}
      <AppShell.Footer>
        <Flex h="100%" px="md" align="center" justify="space-between">
          <Text size="sm" c="dimmed">
            © 2024 Shopping App. All rights reserved.
          </Text>

          <Group gap="md">
            <Anchor href="/privacy" size="sm" c="dimmed">
              Privacy Policy
            </Anchor>
            <Anchor href="/terms" size="sm" c="dimmed">
              Terms of Service
            </Anchor>
            <Anchor href="/contact" size="sm" c="dimmed">
              Contact
            </Anchor>
          </Group>
        </Flex>
      </AppShell.Footer>

      {/* Main Content */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
