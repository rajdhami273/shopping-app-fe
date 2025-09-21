import React from "react";
import { z } from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";

// components
import { TextInput, PasswordInput, Button, Stack, Title } from "@mantine/core";

// hooks
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";

// actions
import { login } from "../../../state/actions/userActions";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      email: "rajendra@mail.com",
      password: "Rajendra@111",
    },
    validate: zod4Resolver(loginSchema),
  });

  const handleSubmit = (values) => {
    console.log("Login form values:", values);
    dispatch(login(values));
  };

  return (
    <Stack spacing="md">
      <Title order={2}>Login</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />

          <Button type="submit" fullWidth>
            Login
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
