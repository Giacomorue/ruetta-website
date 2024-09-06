"use client";

import { LoginSchema, LoginSchemaType } from "@/schemas/schema-auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { Login } from "@/actions/login";
import { toast } from "../ui/use-toast";

function LoginForm() {
  const [inputEnabled, setInputEnabled] = useState(false);
  const adminLoader = useAdminLoader();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log(data);
    adminLoader.startLoading();
    await Login(data)
      .then((res) => {
        if (!res) return;
        // form.reset();
        if (res.success) {
          setInputEnabled(true);
          toast({
            variant: "default",
            title: "Successo",
            description: "Login effettuato con successo",
          });
        }

        if (res.error) {
          toast({
            variant: "destructive",
            title: "Errore",
            description: res.error,
          });
          console.log(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Errore",
        });
      })
      .finally(() => {
        adminLoader.stopLoading();
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="example@example.com" disabled={inputEnabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="*******" type="password" disabled={inputEnabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex flex-row items-center justify-center">
          <Button className="mt-5 w-full" disabled={inputEnabled}>
            Accedi
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
