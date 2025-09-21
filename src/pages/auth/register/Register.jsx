// ts-strict

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
import { useDispatch } from "react-redux";

// actions
import { register } from "../../../state/actions/userActions";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name should only contain letters and spaces",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" }),
    mobileNumber: z
      .string()
      .min(10, { message: "Mobile number must be at least 10 digits" })
      .regex(/^[+]?[\d\s()-]+$/, { message: "Invalid phone number format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
    dob: z
      .union([z.date(), z.string()])
      .refine((val) => val !== null && val !== undefined && val !== "", {
        message: "Date of birth is required",
      })
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .refine(
        (date) => {
          const today = new Date();
          const birthDate = new Date(date);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            return age - 1 >= 13;
          }
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
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      name: "Rajendra Dhami",
      email: "rajendra@mail.com",
      mobileNumber: "+9779800000000",
      password: "Rajendra@111",
      confirmPassword: "Rajendra@111",
      dob: null,
      gender: "male",
      agreeToTOC: true,
    },
    validate: zod4Resolver(registerSchema),
  });

  const handleSubmit = (values) => {
    console.log("Register form values:", values);
    dispatch(register(values));
  };

  return (
    <Stack spacing="md">
      <Title order={2}>Create Account</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <TextInput
            label="Name"
            placeholder="Enter your name"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Mobile Number"
            placeholder="Enter your mobile number"
            {...form.getInputProps("mobileNumber")}
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
            {...form.getInputProps("dob")}
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
