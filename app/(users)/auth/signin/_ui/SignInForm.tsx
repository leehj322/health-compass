"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/app/_ui/shared/Spinner";
import { PASSWORD_REGEX } from "@/constants/regex";
import { useSignin } from "@/lib/queries/useAuthQueries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";

const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일을 입력해주세요."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .regex(PASSWORD_REGEX, "영문 대소문자, 숫자, 특수문자를 포함해야 합니다."),
});

export default function SignInForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSignin();

  const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
    signIn(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.all });
          router.push("/");
        },
        onError: (error) => {
          setFormError(error.message);
        },
      },
    );
  };

  return (
    <>
      {formError && (
        <p className="mb-5 h-10 w-full max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          {formError}
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="mb-1 ml-1 font-bold">이메일</FormLabel>
                <FormControl>
                  <Input
                    type="text" // 브라우저 기본 email validation을 피하기 위해 type="text" 사용 (zod로 validation)
                    placeholder="your@email.com"
                    className="h-10 placeholder:text-sm"
                    {...field}
                  />
                </FormControl>
                <div className="h-2">
                  <FormMessage className="text-right text-xs" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="mb-1 ml-1 font-bold">비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호 입력"
                    className="h-10 placeholder:text-sm"
                    {...field}
                  />
                </FormControl>
                <div className="h-2">
                  <FormMessage className="text-right text-xs" />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="mt-3 h-10 w-full cursor-pointer rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {isPending ? <Spinner /> : "로그인"}
          </Button>
        </form>
      </Form>
    </>
  );
}
