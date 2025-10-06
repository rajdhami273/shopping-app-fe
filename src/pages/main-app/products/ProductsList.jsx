// ts-strict

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Title,
  Button,
  Group,
  Badge,
  Rating,
  NumberInput,
  Stack,
  ActionIcon,
  Paper,
  Box,
  Tooltip,
} from "@mantine/core";
// Using Unicode symbols instead of external icon library
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";

// actions
import { addToCart } from "../../../state/actions/cartActions";
import { getProducts } from "../../../state/actions/productActions";

// selectors
import { selectProductsArray } from "../../../state/selectors/productSelector";

// utils
import { formatNumber } from "../../../utils/number";

// Icons
import { ShoppingCart, Heart } from "react-feather";

// assets
import noImagePlaceholder from "../../../assets/no-image-placeholder.svg";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProductsArray);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1} mb="xs">
              Our Products
            </Title>
            <Text color="dimmed" size="lg">
              Discover amazing products at great prices
            </Text>
          </div>
          <Text size="sm" color="dimmed">
            {products.length} products found
          </Text>
        </Group>

        {/* Products Grid */}
        <Grid gutter="lg">
          {products.map((product) => (
            <Grid.Col
              key={product._id}
              span={{
                base: 12, // 1 column on mobile (extra small screens)
                sm: 6, // 2 columns on small screens
                lg: 4, // 3 columns on large screens
              }}
            >
              <ProductCard product={product} navigate={navigate} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

const ProductCard = ({ product, navigate }) => {
  const [quantity, setQuantity] = useState(1);
  const isInWishlist = false;
  const dispatch = useDispatch();

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({ product: product._id, quantity }));
    // Add to cart using Redux action
    notifications.show({
      title: "Added to Cart",
      message: `${product.name} (${quantity}) added to your cart`,
      color: "green",
    });
  }, [dispatch, product, quantity]);

  const handleProductClick = useCallback(() => {
    navigate(`/products/${product._id}`);
  }, [navigate, product._id]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Box pos="relative">
          <Image
            src={product.assets[0]?.mediaUrl ?? noImagePlaceholder}
            height={240}
            alt={product.name}
            fit="contain"
            style={{ cursor: "pointer" }}
            onClick={handleProductClick}
          />

          {/* Discount Badge */}
          {product.discount > 0 ? (
            <Badge
              color="red"
              variant="filled"
              size="sm"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 1,
              }}
            >
              -{product.discount}%
            </Badge>
          ) : null}

          {/* Wishlist Button */}
          <ActionIcon
            variant="filled"
            color={isInWishlist ? "pink" : "gray"}
            size="lg"
            radius="xl"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
            }}
            onClick={() => {}}
          >
            <Heart
              size={18}
              fill={isInWishlist ? "currentColor" : "none"}
              color={isInWishlist ? "white" : "currentColor"}
            />
          </ActionIcon>

          {/* Out of Stock Overlay */}
          {product.stock <= 0 ? (
            <Paper
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text color="white" weight={700} size="lg">
                Out of Stock
              </Text>
            </Paper>
          ) : null}
        </Box>
      </Card.Section>

      <Stack spacing="md" mt="md">
        {/* Category Badge */}
        <Badge variant="light" size="xs">
          {product.category}
        </Badge>

        {/* Product Name */}
        <Title
          order={4}
          lineClamp={2}
          style={{ cursor: "pointer" }}
          onClick={handleProductClick}
        >
          {product.name}
        </Title>

        {/* Description */}
        <Tooltip label={product.description} multiline w={200}>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {product.description}
          </Text>
        </Tooltip>

        {/* Rating */}
        <Group>
          {product.rating ? (
            <Text size="sm" c="dimmed">
              {product.rating}
            </Text>
          ) : null}
          <Rating value={product.rating} fractions={2} readOnly size="sm" />
          <Text size="sm" c="dimmed">
            {product.reviewCount} reviews
          </Text>
        </Group>

        {/* Price */}
        <Group spacing="xs">
          <Text size="xl" weight={700}>
            {product.currency} {formatNumber(product.price || 0)}
          </Text>
          {product.originalPrice > product.price ? (
            <Text size="md" color="dimmed" strikethrough>
              {product.currency} {formatNumber(product.originalPrice || 0)}
            </Text>
          ) : null}
        </Group>

        {/* Quantity Selector and Add to Cart */}
        <Group spacing="sm">
          <NumberInput
            value={quantity}
            onChange={(value) => setQuantity(value)}
            min={1}
            max={product.stock}
            size="sm"
            style={{ width: 80 }}
            disabled={product.stock <= 0}
          />
          <Button
            leftSection={<ShoppingCart size={18} />}
            variant="filled"
            flex={1}
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default ProductsList;
