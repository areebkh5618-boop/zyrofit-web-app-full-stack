import { Suspense } from "react";
import AuthForm from "@/components/ui/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
