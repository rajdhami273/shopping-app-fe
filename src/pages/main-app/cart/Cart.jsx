// ts-strict

import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Title,
  Button,
  Group,
  Stack,
  ActionIcon,
  NumberInput,
  Divider,
  Alert,
  Badge,
  Paper,
  Box,
  Center,
} from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "react-feather";
import { Link } from "react-router";

// actions
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../../state/actions/cartActions";

// selectors
import {
  selectCartItemsAsArray,
  selectCartTotalItems,
  selectCartTotalPrice,
} from "../../../state/selectors/cartSelector";
import { selectUserCurrency } from "../../../state/selectors/userSelector";

// utils
import { formatNumber } from "../../../utils/number";

// assets
import noImagePlaceholder from "../../../assets/no-image-placeholder.svg";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItemsAsArray);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const currency = useSelector(selectUserCurrency);
  // Cart calculations
  const subtotal = totalPrice;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 500 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + taxAmount + shippingCost;

  const handleClearCart = () => {
    dispatch(clearCart());

    notifications.show({
      title: "Cart Cleared",
      message: "All items removed from your cart",
      color: "orange",
    });
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    notifications.show({
      title: "Checkout",
      message: "Checkout functionality coming soon!",
      color: "green",
    });
  };

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  // Empty cart state
  if (items.length === 0) {
    return (
      <Container size="md" py="xl">
        <Center mih={400}>
          <Stack align="center" spacing="xl">
            <Box ta="center">
              <ShoppingBag size={80} color="#868e96" />
              <Title order={2} mt="md" c="dimmed">
                Your cart is empty
              </Title>
              <Text size="lg" c="dimmed" mt="sm">
                Add some products to get started
              </Text>
            </Box>

            <Button
              size="lg"
              leftSection={<ArrowLeft size={20} />}
              component={Link}
              to="/products"
            >
              Continue Shopping
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1} mb="xs">
              Shopping Cart
            </Title>
            <Text c="dimmed" size="lg">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </Text>
          </div>

          <Group>
            <Button
              variant="outline"
              leftSection={<ArrowLeft size={18} />}
              component={Link}
              to="/products"
            >
              Continue Shopping
            </Button>

            {items.length > 1 && (
              <Button variant="light" color="red" onClick={handleClearCart}>
                Clear Cart
              </Button>
            )}
          </Group>
        </Group>

        <Grid gutter="xl">
          {/* Cart Items */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack spacing="md">
              {items.map((item) => (
                <CartItem key={item.product?._id} item={item} />
              ))}
            </Stack>
          </Grid.Col>

          {/* Order Summary */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper withBorder padding="lg" radius="md" pos="sticky" top={20}>
              <Stack spacing="md">
                <Title order={3} pl="md" pt="md">
                  Order Summary
                </Title>

                <Divider />

                <Group justify="space-between" pl="md">
                  <Text>Subtotal ({totalItems} items)</Text>
                  <Text fw={500} pr="md">
                    {currency} {formatNumber(subtotal)}
                  </Text>
                </Group>

                <Group justify="space-between" pl="md">
                  <Text>Tax ({(taxRate * 100).toFixed(0)}%)</Text>
                  <Text fw={500} pr="md">
                    {currency} {formatNumber(taxAmount)}
                  </Text>
                </Group>

                <Group justify="space-between" pl="md">
                  <Text>Shipping</Text>
                  <Text fw={500} pr="md">
                    {shippingCost === 0 ? (
                      <Text span c="green">
                        FREE
                      </Text>
                    ) : (
                      `${currency} ${formatNumber(shippingCost)}`
                    )}
                  </Text>
                </Group>

                {subtotal < 500 && (
                  <Alert color="blue" variant="light" radius="md" pl="md">
                    <Text size="sm">
                      Add ${formatNumber(50 - subtotal)} more for free shipping!
                    </Text>
                  </Alert>
                )}

                <Divider />

                <Group justify="space-between" pl="md">
                  <Text size="lg" fw={700}>
                    Total
                  </Text>
                  <Text size="xl" fw={700} c="blue" pr="md">
                    {currency} {formatNumber(total)}
                  </Text>
                </Group>

                <Button
                  size="lg"
                  m="md"
                  leftSection={<ShoppingBag size={20} />}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Text size="xs" c="dimmed" ta="center">
                  Secure checkout with SSL encryption
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const { product } = item;
  const itemTotal = (product?.price ?? 1) * quantity;

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    dispatch(updateQuantity({ productId, quantity: newQuantity }));

    notifications.show({
      title: "Quantity Updated",
      message: "Cart updated successfully",
      color: "blue",
    });
  };

  const handleRemoveItem = (productId) => {
    console.log("productId", productId);
    dispatch(removeFromCart(productId));

    notifications.show({
      title: "Item Removed",
      message: "Item removed from your cart",
      color: "red",
    });
  };

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <Card withBorder padding="lg" radius="md">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Image
            src={product?.assets?.[0]?.mediaUrl || noImagePlaceholder}
            height={120}
            fit="contain"
            radius="sm"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack spacing="sm">
            <div>
              <Text size="lg" fw={600} lineClamp={2}>
                {product?.name}
              </Text>
              <Badge variant="light" size="sm" mt="xs">
                {product?.category}
              </Badge>
            </div>

            <Text size="sm" c="dimmed" lineClamp={2}>
              {product?.description}
            </Text>

            <Group spacing="xs">
              <Text size="lg" fw={700} c="blue">
                {product?.currency} {formatNumber(product?.price)}
              </Text>
              {product?.originalPrice > product?.price && (
                <Text size="sm" c="dimmed" td="line-through">
                  {product?.currency} {formatNumber(product?.originalPrice)}
                </Text>
              )}
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Stack spacing="sm" h="100%">
            {/* Quantity Controls */}
            <Group spacing="xs" justify="center">
              <ActionIcon
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item?._id, quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </ActionIcon>

              <NumberInput
                value={quantity}
                onBlur={() => {
                  if (quantity > (product?.stock || 99)) {
                    setQuantity(product?.stock || 99);
                    handleUpdateQuantity(item?._id, product?.stock || 99);
                  } else {
                    handleUpdateQuantity(item?._id, quantity);
                  }
                }}
                onChange={setQuantity}
                min={1}
                max={product?.stock || 99}
                size="sm"
                w={60}
                hideControls
              />

              <ActionIcon
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item?._id, quantity + 1)}
                disabled={quantity >= (product?.stock || 99)}
              >
                <Plus size={14} />
              </ActionIcon>
            </Group>

            {/* Item Total */}
            <Text size="lg" fw={700} ta="center">
              {product?.currency} {formatNumber(itemTotal)}
            </Text>

            {/* Remove Button */}
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<Trash2 size={16} />}
              onClick={() => handleRemoveItem(item?._id)}
              fullWidth
            >
              Remove
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default Cart;
