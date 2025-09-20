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
  Select,
  Checkbox,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

// hooks
import { useForm } from "@mantine/form";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Full name should only contain letters and spaces",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .regex(/^[+]?[\d\s()-]+$/, { message: "Invalid phone number format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
    dateOfBirth: z.date({ message: "Date of birth is required" }).refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 13;
      },
      { message: "You must be at least 13 years old" }
    ),
    gender: z.string().min(1, { message: "Please select your gender" }),
    agreeToTOC: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: null,
      gender: "",
      agreeToTOC: false,
    },
    validate: zod4Resolver(registerSchema),
  });

  const handleSubmit = (values) => {
    console.log("Register form values:", values);
    // TODO: Implement registration logic here
  };

  return (
    <Stack spacing="md">
      <Title order={2}>Create Account</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps("fullName")}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            {...form.getInputProps("phoneNumber")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps("confirmPassword")}
          />

          <DatePickerInput
            label="Date of Birth"
            placeholder="Select your date of birth"
            maxDate={new Date()}
            {...form.getInputProps("dateOfBirth")}
          />

          <Select
            label="Gender"
            placeholder="Select your gender"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer-not-to-say", label: "Prefer not to say" },
            ]}
            {...form.getInputProps("gender")}
          />

          <Checkbox
            label="I agree to the Terms and Conditions"
            {...form.getInputProps("agreeToTOC")}
          />

          <Button type="submit" fullWidth>
            Create Account
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
