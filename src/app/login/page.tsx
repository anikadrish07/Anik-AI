
import { LoginForm } from "@/components/auth/login-form";
import { MessageSquare } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MindFlux AI</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
