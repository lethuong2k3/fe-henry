import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { loginApi } from "@/service/auth-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type LoginType = z.infer<typeof LoginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const {setIsAuThenticated} = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginType) => {
    if (loading) return;
    setLoading(true);
    loginApi(data.email, data.password).then(() => {
      toast.success('Login successfully!')
      setIsAuThenticated(true);
      navigate('/dashboard')
    }).catch(err => {
      console.log(err);
      toast.error('Error Login!')
    }).finally(() => {
      setLoading(false);
    }
    )
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-8 p-6 max-w-md mx-auto", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-5">Login</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to access your account
            </p>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FieldLabel className="text-base font-medium">Email</FieldLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    className="h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-base font-medium">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-sm text-primary font-medium underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    className="h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button */}
          <Field>
            <Button
              type="submit"
              className="h-11 text-lg font-semibold tracking-wide"
            >
              Login
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
