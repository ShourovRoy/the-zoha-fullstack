'use client'

import { login } from "@/actions/auth"
import { loginFormState } from "@/lib/definitions"

import { Eye, EyeOff } from "lucide-react"
import { useActionState, useState } from "react"

const LoginForm = () => {
    // Explicitly typed hook prevents TypeScript mismatch errors with the Server Action
    const [loginState, loginAction, loginPending] = useActionState(
        login,
        undefined
    )

    // Client-side state to toggle password string visibility
    const [showPassword, setShowPassword] = useState(false)

    return (
        // Responsive wrapper utilizing the soft neutral 'stone-50' backdrop
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-8 md:py-16">

            {/* Saffron Brand Logo Space */}
            <div className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">
                your<span className="text-amber-600">shop</span>
            </div>

            {/* Clean, sharp Amazon-style Card Layout */}
            <div className="w-full max-w-100 bg-white border border-neutral-200 rounded-md p-5 sm:p-6 shadow-sm">
                <h1 className="text-2xl font-normal text-neutral-900 mb-5">Sign in</h1>

                {/* Global Server-Side Error Banner */}
                {loginState?.errorMessage && (
                    <div className="mb-4 text-sm text-rose-600 bg-rose-50 p-3 rounded border border-rose-100 flex items-start gap-2 font-medium">
                        <span className="text-base leading-none">⚠</span>
                        <div>{loginState.errorMessage}</div>
                    </div>
                )}

                <form action={loginAction} className="space-y-4">

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="name@domain.com"
                            className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        />
                        {loginState?.errors?.email && (
                            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                <span>⚠</span> {loginState.errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password Field with Inline Eye Toggle */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                Password
                            </label>
                            <a href="#" className="text-xs text-amber-700 hover:text-amber-800 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Relative wrapper keeps the toggle button cleanly tucked inside the input rim */}
                        <div className="relative flex items-center">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="w-full pl-3 pr-10 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            />
                            <button
                                type="button" // CRITICAL: type="button" prevents accidental form submission
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {loginState?.errors?.password && (
                            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                <span>⚠</span> {loginState.errors.password[0]}
                            </p>
                        )}
                    </div>

                    {/* Primary Sign In Button */}
                    <button
                        disabled={loginPending}
                        type="submit"
                        className="w-full mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-neutral-950 font-medium text-sm py-2 px-4 rounded shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loginPending ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Footer Break Line */}
                <hr className="my-5 border-neutral-200" />

                {/* Secondary Bottom Navigation Link */}
                <div className="text-xs text-neutral-600 text-center">
                    <p className="text-neutral-500 mb-2">New to our shop?</p>
                    <a
                        href="/auth/signup"
                        className="block w-full border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-normal py-1.5 px-4 rounded shadow-xs text-sm transition-colors"
                    >
                        Create your account
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LoginForm