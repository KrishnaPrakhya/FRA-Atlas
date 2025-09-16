import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />

        {/* Demo credentials info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Demo Credentials</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p>
              <strong>Official:</strong> official@fra.gov.in / password123
            </p>
            <p>
              <strong>Claimant:</strong> claimant@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
