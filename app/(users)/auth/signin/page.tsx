import AuthTitle from "../_ui/AuthTitle";
import SignInForm from "./_ui/SignInForm";
import FormDivider from "../_ui/FormDivider";
import SocialSignInButtons from "../_ui/SocialSignInButtons";
import AuthPageRedirectLink from "../_ui/AuthRedirectLink";

export default function SignInPage() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center bg-white px-4 sm:mt-28 sm:px-6 md:px-8 lg:mt-35">
      <AuthTitle />
      <SignInForm />

      <FormDivider />

      <SocialSignInButtons />
      <AuthPageRedirectLink href="/auth/signup">
        회원이 아니신가요?
      </AuthPageRedirectLink>
    </div>
  );
}
