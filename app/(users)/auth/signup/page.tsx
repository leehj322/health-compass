import AuthTitle from "../_ui/AuthTitle";
import SignUpForm from "./_ui/SignUpForm";
import FormDivider from "../_ui/FormDivider";
import SocialSignInButtons from "../_ui/SocialSignInButtons";
import AuthPageRedirectLink from "../_ui/AuthRedirectLink";

export default function SignUpPage() {
  return (
    <div className="mt-15 flex flex-col items-center justify-center bg-white px-4 sm:mt-23 sm:px-6 md:px-8 lg:mt-30">
      <AuthTitle />
      <SignUpForm />

      <FormDivider />

      <SocialSignInButtons />
      <AuthPageRedirectLink href="/auth/signin">
        이미 회원이신가요?
      </AuthPageRedirectLink>
    </div>
  );
}
