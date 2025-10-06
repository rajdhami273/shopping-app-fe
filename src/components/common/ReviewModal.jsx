// ts-strict

import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

// components
import {
  Modal,
  Stack,
  Title,
  Text,
  Textarea,
  Button,
  Group,
  Rating,
  FileInput,
  Image,
  ActionIcon,
  Paper,
  Alert,
  Grid,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

// hooks
// import { useDisclosure } from '@mantine/hooks'; // Not used in this component

// icons
import { Star, Upload, X, AlertCircle, Camera } from "react-feather";

// actions
import { createReview } from "../../state/actions/reviewActions";

// styles
import styles from "./ReviewModal.module.css";

const ReviewModal = ({
  opened,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const form = useForm({
    initialValues: {
      rating: 0,
      review: "",
      images: [],
    },
    validate: {
      rating: (value) => (value === 0 ? "Please select a rating" : null),
      review: (value) =>
        value.trim().length < 10
          ? "Review must be at least 10 characters long"
          : null,
    },
  });

  const handleImageUpload = useCallback(
    (files) => {
      if (!files) return;

      const newImages = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);
      form.setFieldValue("images", [...form.values.images, ...files]);
    },
    [form]
  );

  const removeImage = useCallback(
    (imageId) => {
      setUploadedImages((prev) => {
        const imageToRemove = prev.find((img) => img.id === imageId);
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.url);
        }
        return prev.filter((img) => img.id !== imageId);
      });

      // Update form values
      const remainingFiles = uploadedImages
        .filter((img) => img.id !== imageId)
        .map((img) => img.file);
      form.setFieldValue("images", remainingFiles);
    },
    [uploadedImages, form]
  );

  const handleSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("product", productId);
        formData.append("rating", values.rating);
        formData.append("review", values.review);

        // Add images to form data
        values.images.forEach((image) => {
          formData.append(`images`, image);
        });

        // Dispatch create review action (no need for .unwrap() with custom callAPI pattern)
        dispatch(
          createReview({
            data: formData,
            successCallback: () => {
              onReviewSubmitted?.();
              notifications.show({
                title: "Review Submitted!",
                message:
                  "Thank you for your feedback. Your review has been submitted successfully.",
                color: "green",
                icon: <Star size={16} />,
              });
              // Reset form and close modal
              form.reset();
              setUploadedImages([]);
              onClose?.();
            },
            errorCallback: () => {
              notifications.show({
                title: "Error",
                message: "Failed to submit review. Please try again.",
                color: "red",
                icon: <AlertCircle size={16} />,
              });
            },
          })
        );
      } catch (error) {
        console.error("Error submitting review:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [productId, form, onClose, onReviewSubmitted, dispatch]
  );

  const handleClose = useCallback(() => {
    if (isSubmitting) return;

    // Clean up image URLs
    uploadedImages.forEach((img) => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    form.reset();
    onClose();
  }, [isSubmitting, uploadedImages, form, onClose]);

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: "😞 Terrible",
      2: "😕 Poor",
      3: "😐 Average",
      4: "😊 Good",
      5: "🤩 Excellent",
    };
    return ratingTexts[rating] || "Select rating";
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm" align="center">
          <Star size={20} />
          <Title order={3}>Write a Review</Title>
        </Group>
      }
      size="lg"
      centered
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      withCloseButton={!isSubmitting}
      className={styles.modal}
    >
      <Stack gap="lg">
        {/* Product Info */}
        <Paper className={styles.productInfo} p="md" withBorder>
          <Text size="sm" c="dimmed">
            Writing review for:
          </Text>
          <Text fw={500} truncate>
            {productName}
          </Text>
        </Paper>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* Rating Section */}
            <Box>
              <Group gap="md" align="center" mb="xs">
                <Text fw={500}>Overall Rating *</Text>
                <Text size="sm" c="dimmed" className={styles.ratingText}>
                  {getRatingText(form.values.rating)}
                </Text>
              </Group>

              <Rating
                value={form.values.rating}
                onChange={(value) => form.setFieldValue("rating", value)}
                size="xl"
                className={styles.rating}
                count={5}
                {...form.getInputProps("rating")}
              />

              {form.errors.rating && (
                <Text size="sm" c="red" mt="xs">
                  {form.errors.rating}
                </Text>
              )}
            </Box>

            {/* Review Text */}
            <Box>
              <Text fw={500} mb="xs">
                Your Review *
              </Text>
              <Textarea
                placeholder="Share your thoughts about this product. What did you like or dislike? How was the quality? Would you recommend it to others?"
                minRows={4}
                maxRows={8}
                {...form.getInputProps("review")}
                className={styles.textarea}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Minimum 10 characters ({form.values.review.length}/10)
              </Text>
            </Box>

            {/* Image Upload */}
            <Box>
              <Group gap="md" align="center" mb="sm">
                <Text fw={500}>Add Photos (Optional)</Text>
                <Text size="xs" c="dimmed">
                  Help others by sharing photos of the product
                </Text>
              </Group>

              <FileInput
                placeholder="Click to select images or drag and drop"
                leftSection={<Camera size={16} />}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                disabled={isSubmitting}
              />

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <Box mt="md">
                  <Text size="sm" fw={500} mb="sm">
                    Selected Images ({uploadedImages.length})
                  </Text>
                  <Grid gutter="sm">
                    {uploadedImages.map((image) => (
                      <Grid.Col key={image.id} span={4}>
                        <Paper
                          className={styles.imagePreview}
                          p="xs"
                          withBorder
                        >
                          <Box className={styles.imageContainer}>
                            <Image
                              src={image.url}
                              alt="Review image"
                              className={styles.previewImage}
                            />
                            <ActionIcon
                              color="red"
                              variant="filled"
                              size="sm"
                              className={styles.removeButton}
                              onClick={() => removeImage(image.id)}
                              disabled={isSubmitting}
                            >
                              <X size={12} />
                            </ActionIcon>
                          </Box>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Guidelines */}
            <Alert
              icon={<AlertCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                <strong>Review Guidelines:</strong> Please be honest and
                constructive. Focus on the product quality, features, and your
                experience. Avoid inappropriate language or personal
                information.
              </Text>
            </Alert>

            {/* Action Buttons */}
            <Group justify="flex-end" gap="md" mt="xl">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                leftSection={<Star size={16} />}
                disabled={
                  form.values.rating === 0 ||
                  form.values.review.trim().length < 10
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

export default ReviewModal;
