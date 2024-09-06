import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

function Auth() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Card className="w-[95%] max-w-[500px]">
        <CardHeader>
          <CardTitle className="w-full flex flex-row items-center justify-center">
            <Image src={"/logo.png"} width={200} height={100} alt="Logo" />
          </CardTitle>
          <CardDescription className="text-sm text-center mt-2">
            Usa le tue credenziali per accedere nella dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default Auth;
