import { SignupForm } from "@/components/auth/signup-form";
import { Bot } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Bot className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Join MindFlux AI</h1>
          <p className="mt-2 text-muted-foreground">Create your account to start chatting</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
