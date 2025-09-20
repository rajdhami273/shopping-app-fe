import React from "react";
import { z } from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";

// components
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  PinInput,
  Group,
  Text,
} from "@mantine/core";

// hooks
import { useForm } from "@mantine/form";

const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" }),
    otp: z
      .string()
      .length(6, { message: "OTP must be exactly 6 digits" })
      .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const form = useForm({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(resetPasswordSchema),
  });

  const handleSubmit = (values) => {
    console.log("Reset password form values:", values);
    // TODO: Implement reset password logic here
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP logic
    console.log("Resending OTP to:", form.values.email);
  };

  return (
    <Stack spacing="md">
      <Title order={2}>Reset Password</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <TextInput
            label="Email"
            placeholder="Enter your email address"
            {...form.getInputProps("email")}
          />

          <div>
            <Text size="sm" mb={5}>
              Enter OTP
            </Text>
            <Group>
              <PinInput
                length={6}
                type="number"
                placeholder=""
                {...form.getInputProps("otp")}
              />
            </Group>
            {form.errors.otp && (
              <Text color="red" size="sm" mt={5}>
                {form.errors.otp}
              </Text>
            )}
            <Button
              p={0}
              variant="transparent"
              size="xs"
              mt={10}
              onClick={handleResendOTP}
              disabled={!form.values.email || !!form.errors.email}
            >
              Resend OTP
            </Button>
          </div>

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            {...form.getInputProps("newPassword")}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            {...form.getInputProps("confirmPassword")}
          />

          <Button type="submit" fullWidth>
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
