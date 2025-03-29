"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

const signUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("유효한 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        PASSWORD_REGEX,
        "영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export default function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = () => {
    console.log("submit!!!");
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
                    type="email"
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

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="mb-1 ml-1 font-bold">
                  비밀번호 확인
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="다시 입력"
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
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="mt-3 h-10 w-full cursor-pointer rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {form.formState.isSubmitting ? <Spinner /> : "가입하기"}
          </Button>
        </form>
      </Form>
    </>
  );
}
