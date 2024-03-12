import LoginForm from "@/components/auth/email/login_form";

export default function LoginPage() {
  return (
    <>
      <div className=" mt-16 flex flex-col items-center justify-center space-y-4">
        <h1 className=" text-4xl font-bold">Log in to MySurface</h1>
        <LoginForm />
      </div>
    </>
  );
}
