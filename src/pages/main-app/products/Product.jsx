// ts-strict

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

// components
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
  Divider,
  SimpleGrid,
  List,
  ThemeIcon,
  Tabs,
  Avatar,
  ScrollArea,
  Breadcrumbs,
  Anchor,
  Alert,
  Skeleton,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { notifications } from "@mantine/notifications";
import ReviewModal from "../../../components/common/ReviewModal";

// hooks
import { useDisclosure } from "@mantine/hooks";

// actions
import { addToCart } from "../../../state/actions/cartActions";
import { getProduct } from "../../../state/actions/productActions";
import { getProductReviews } from "../../../state/actions/reviewActions";

// selectors
import { selectProductsArray } from "../../../state/selectors/productSelector";
import { selectProductReviews } from "../../../state/selectors/reviewSelector";

// utils
import { formatNumber } from "../../../utils/number";

// icons
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
  ArrowLeft,
  User,
  Package,
  Info,
  Gift,
} from "react-feather";

// assets
import noImagePlaceholder from "../../../assets/no-image-placeholder.svg";

// styles
import styles from "./Product.module.css";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectProductsArray);
  const productReviews = useSelector((state) =>
    selectProductReviews(state, id)
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlist, { toggle: toggleWishlist }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState("description");
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);

  // Find product by ID
  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (!product) {
      dispatch(getProduct(id));
    }
    if (id) {
      dispatch(getProductReviews(id));
    }
  }, [dispatch, product, id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    dispatch(addToCart({ product: product._id, quantity }));
    notifications.show({
      title: "Added to Cart",
      message: `${product.name} (${quantity}) added to your cart`,
      color: "green",
      icon: <Check size={16} />,
    });
  }, [dispatch, product, quantity]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: "Link Copied",
        message: "Product link copied to clipboard",
        color: "blue",
      });
    }
  }, [product]);

  const handleReviewSubmitted = useCallback(() => {
    // Refresh reviews when a new review is submitted
    if (id) {
      dispatch(getProductReviews(id));
    }
  }, [dispatch, id]);
  const fetchProduct = useCallback(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  if (!product) {
    return (
      <Container size="xl" py="xl">
        <ProductSkeleton />
      </Container>
    );
  }

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: product.name, href: `/products/${product._id}` },
  ].map((item, index) => (
    <Anchor
      key={index}
      onClick={() => navigate(item.href)}
      className={styles.breadcrumbLink}
    >
      {item.title}
    </Anchor>
  ));

  const productImages =
    product.assets?.length > 0
      ? product.assets.map((asset) => asset.mediaUrl)
      : [noImagePlaceholder];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Breadcrumbs */}
        <Group justify="space-between" align="center">
          <Breadcrumbs separator=">">{breadcrumbItems}</Breadcrumbs>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate("/products")}
            className={styles.backButton}
          >
            Back to Products
          </Button>
        </Group>

        {/* Main Product Section */}
        <Grid gutter="xl">
          {/* Product Images */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              padding="md"
              radius="md"
              withBorder
              className={styles.imageCard}
            >
              <Stack gap="md">
                {/* Main Image */}
                <Box className={styles.mainImageContainer}>
                  <Image
                    src={productImages[activeImage]}
                    alt={product.name}
                    className={styles.mainImage}
                  />

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Badge
                      color="red"
                      variant="filled"
                      size="lg"
                      className={styles.discountBadge}
                    >
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Wishlist & Share Actions */}
                  <Group className={styles.actionButtons}>
                    <ActionIcon
                      variant="filled"
                      color={isWishlist ? "pink" : "gray"}
                      size="lg"
                      radius="xl"
                      onClick={toggleWishlist}
                    >
                      <Heart
                        size={18}
                        fill={isWishlist ? "currentColor" : "none"}
                      />
                    </ActionIcon>
                    <ActionIcon
                      variant="filled"
                      color="blue"
                      size="lg"
                      radius="xl"
                      onClick={handleShare}
                    >
                      <Share2 size={18} />
                    </ActionIcon>
                  </Group>
                </Box>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <ScrollArea scrollbarSize={6}>
                    <Group gap="xs" wrap="nowrap">
                      {productImages.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className={`${styles.thumbnail} ${
                            activeImage === index ? styles.activeThumbnail : ""
                          }`}
                          onClick={() => setActiveImage(index)}
                        />
                      ))}
                    </Group>
                  </ScrollArea>
                )}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Product Details */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              {/* Category & Brand */}
              <Group gap="xs">
                <Badge variant="light" size="sm">
                  {product.category}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" size="sm">
                    {product.brand}
                  </Badge>
                )}
              </Group>

              {/* Product Name */}
              <Title order={1} className={styles.productTitle}>
                {product.name}
              </Title>

              {/* Rating & Reviews */}
              <Group gap="sm">
                <Rating value={product.rating || 0} fractions={2} readOnly />
                <Text size="sm" c="dimmed">
                  ({product.reviewCount || 0} reviews)
                </Text>
              </Group>

              {/* Price */}
              <Group gap="sm" align="baseline">
                <Text size="2rem" fw={700} c="dark">
                  {product.currency} {formatNumber(product.price || 0)}
                </Text>
                {product.originalPrice > product.price && (
                  <Text size="lg" c="dimmed" td="line-through">
                    {product.currency}{" "}
                    {formatNumber(product.originalPrice || 0)}
                  </Text>
                )}
                {product.discount > 0 && (
                  <Text size="sm" c="green" fw={600}>
                    Save {product.discount}%
                  </Text>
                )}
              </Group>

              {/* Stock Status */}
              <Alert
                color={
                  product.stock > 10
                    ? "green"
                    : product.stock > 0
                    ? "yellow"
                    : "red"
                }
                variant="light"
                icon={<Package size={16} />}
              >
                {product.stock > 10
                  ? `In Stock (${product.stock} available)`
                  : product.stock > 0
                  ? `Only ${product.stock} left in stock`
                  : "Out of Stock"}
              </Alert>

              {/* Short Description */}
              <Text size="md" c="dimmed">
                {product.description}
              </Text>

              <Divider />

              {/* Quantity & Add to Cart */}
              <Stack gap="md">
                <Group gap="md">
                  <Text fw={500}>Quantity:</Text>
                  <NumberInput
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={product.stock}
                    size="md"
                    w={120}
                    disabled={product.stock <= 0}
                  />
                </Group>

                <Group gap="md">
                  <Button
                    size="lg"
                    leftSection={<ShoppingCart size={20} />}
                    disabled={product.stock <= 0}
                    onClick={handleAddToCart}
                    flex={1}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </Button>
                </Group>
              </Stack>

              {/* Features */}
              <Card withBorder padding="md" className={styles.featuresCard}>
                <SimpleGrid cols={2} spacing="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="blue" size="sm">
                      <Truck size={14} />
                    </ThemeIcon>
                    <Text size="sm">Free Shipping</Text>
                  </Group>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="green" size="sm">
                      <Shield size={14} />
                    </ThemeIcon>
                    <Text size="sm">Secure Payment</Text>
                  </Group>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="orange" size="sm">
                      <RefreshCw size={14} />
                    </ThemeIcon>
                    <Text size="sm">Easy Returns</Text>
                  </Group>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="pink" size="sm">
                      <Gift size={14} />
                    </ThemeIcon>
                    <Text size="sm">Gift Wrapping</Text>
                  </Group>
                </SimpleGrid>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Product Details Tabs */}
        <Card withBorder padding="lg" radius="md">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="description" leftSection={<Info size={16} />}>
                Description
              </Tabs.Tab>
              <Tabs.Tab value="specifications">Specifications</Tabs.Tab>
              <Tabs.Tab value="reviews" leftSection={<Star size={16} />}>
                Reviews ({productReviews?.length || 0})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="description" pt="md">
              <Stack gap="md">
                <Title order={3}>Product Description</Title>
                <Text>
                  {product.description ||
                    "No detailed description available for this product."}
                </Text>

                {product.features && (
                  <>
                    <Title order={4} mt="md">
                      Key Features
                    </Title>
                    <List spacing="xs">
                      {product.features.map((feature, index) => (
                        <List.Item key={index}>{feature}</List.Item>
                      ))}
                    </List>
                  </>
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="specifications" pt="md">
              <Stack gap="md">
                <Title order={3}>Specifications</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Paper withBorder p="md">
                    <Stack gap="xs">
                      <Text fw={500}>Brand</Text>
                      <Text c="dimmed">{product.brand || "Not specified"}</Text>
                    </Stack>
                  </Paper>
                  <Paper withBorder p="md">
                    <Stack gap="xs">
                      <Text fw={500}>Category</Text>
                      <Text c="dimmed">
                        {product.category || "Not specified"}
                      </Text>
                    </Stack>
                  </Paper>
                  <Paper withBorder p="md">
                    <Stack gap="xs">
                      <Text fw={500}>Weight</Text>
                      <Text c="dimmed">
                        {product.weight
                          ? `${product.weight} kg`
                          : "Not specified"}
                      </Text>
                    </Stack>
                  </Paper>
                  <Paper withBorder p="md">
                    <Stack gap="xs">
                      <Text fw={500}>Dimensions</Text>
                      <Text c="dimmed">
                        {product.dimensions || "Not specified"}
                      </Text>
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="reviews" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Customer Reviews</Title>
                  <Button
                    variant="outline"
                    size="sm"
                    leftSection={<Star size={16} />}
                    onClick={openReviewModal}
                  >
                    Write a Review
                  </Button>
                </Group>

                {/* Reviews List */}
                {productReviews && productReviews.length > 0 ? (
                  <Stack gap="md">
                    {productReviews.map((review) => (
                      <Paper key={review._id} withBorder p="md">
                        <Group gap="md" align="flex-start">
                          <Avatar color="blue" radius="sm">
                            <User size={16} />
                          </Avatar>
                          <Stack gap="xs" flex={1}>
                            <Group justify="space-between">
                              <Text fw={500}>
                                {review.user?.name || "Anonymous User"}
                              </Text>
                              <Rating
                                value={review.rating}
                                size="sm"
                                readOnly
                              />
                            </Group>
                            <Text size="sm" c="dimmed">
                              {review.review}
                            </Text>
                            {review.assets && review.assets.length > 0 && (
                              <Group gap="xs" mt="xs">
                                {review.assets.map((asset, index) => (
                                  <Image
                                    key={index}
                                    src={asset.mediaUrl}
                                    alt={`Review image ${index + 1}`}
                                    width={60}
                                    height={60}
                                    radius="sm"
                                    fit="cover"
                                  />
                                ))}
                              </Group>
                            )}
                            <Text size="xs" c="dimmed">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </Stack>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Paper withBorder p="xl" ta="center">
                    <Stack gap="md" align="center">
                      <Star size={48} color="var(--mantine-color-gray-4)" />
                      <Stack gap="xs" align="center">
                        <Text size="lg" fw={500}>
                          No reviews yet
                        </Text>
                        <Text size="sm" c="dimmed">
                          Be the first to review this product!
                        </Text>
                      </Stack>
                      <Button
                        leftSection={<Star size={16} />}
                        onClick={openReviewModal}
                      >
                        Write the First Review
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>

        {/* Review Modal */}
        <ReviewModal
          opened={reviewModalOpened}
          onClose={closeReviewModal}
          productId={id}
          productName={product?.name}
          onReviewSubmitted={() => {
            handleReviewSubmitted();
            fetchProduct();
          }}
        />
      </Stack>
    </Container>
  );
};

const ProductSkeleton = () => (
  <Grid gutter="xl">
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Stack gap="md">
        <Skeleton height={400} radius="md" />
        <Group gap="xs">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} width={80} radius="sm" />
          ))}
        </Group>
      </Stack>
    </Grid.Col>
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Stack gap="md">
        <Skeleton height={20} width="70%" />
        <Skeleton height={40} width="100%" />
        <Skeleton height={20} width="50%" />
        <Skeleton height={30} width="40%" />
        <Skeleton height={100} />
        <Skeleton height={50} />
        <Skeleton height={50} />
      </Stack>
    </Grid.Col>
  </Grid>
);

export default Product;
