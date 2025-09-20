import React from "react";
import { z } from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";

// components
import {
  Button,
  Stack,
  Title,
  PinInput,
  Group,
  Text,
  Center,
} from "@mantine/core";

// hooks
import { useForm } from "@mantine/form";

const verifySchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export default function Verify() {
  const form = useForm({
    initialValues: {
      otp: "",
    },
    validate: zod4Resolver(verifySchema),
  });

  const handleSubmit = (values) => {
    console.log("Verify OTP form values:", values);
    // TODO: Implement OTP verification logic here
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP logic
    console.log("Resending OTP");
  };

  return (
    <Stack spacing="md">
      <Title order={2}>Verify Your Account</Title>

      <Text size="sm" c="dimmed">
        Please enter the 6-digit verification code sent to your email address
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="lg">
          <div>
            <Text size="sm" mb={10}>
              Enter OTP
            </Text>

            <PinInput
              length={6}
              type="number"
              size="lg"
              placeholder=""
              {...form.getInputProps("otp")}
            />

            {form.errors.otp && (
              <Text color="red" size="sm" mt={5} ta="center">
                {form.errors.otp}
              </Text>
            )}
          </div>

          <Stack spacing="sm">
            <Button type="submit" fullWidth>
              Verify Account
            </Button>

            <Text size="sm" c="dimmed">
              Didn't receive the code?{" "}
              <Button
                variant="subtle"
                size="compact-sm"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            </Text>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
