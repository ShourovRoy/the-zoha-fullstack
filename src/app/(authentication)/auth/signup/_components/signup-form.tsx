'use client'

import { signup } from '@/actions/auth'
import { useActionState, useState, useEffect } from 'react'

const SignupForm = () => {
    const [signupState, signupAction, signupPending] = useActionState(signup, undefined)

    // Client-side states for real-time tracking
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isMismatched, setIsMismatched] = useState(false)

    // Check if passwords match whenever either field changes
    useEffect(() => {
        if (password && confirmPassword) {
            setIsMismatched(password !== confirmPassword)
        } else {
            setIsMismatched(false)
        }
    }, [password, confirmPassword])

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-8 md:py-16">

            {/* Saffron Brand Identifier */}
            <div className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">
                your<span className="text-amber-600">shop</span>
            </div>

            {/* Amazon-style Form Card */}
            <div className="w-full max-w-100 bg-white border border-neutral-200 rounded-md p-5 sm:p-6 shadow-sm">
                <h1 className="text-2xl font-normal text-neutral-900 mb-5">Create account</h1>

                <form action={signupAction} className="space-y-4">

                    {/* First Name & Last Name Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                placeholder="Shourov"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            />
                            {signupState?.errors?.firstName && (
                                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                    <span>⚠</span> {signupState.errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                placeholder="Roy"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            />
                            {signupState?.errors?.lastName && (
                                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                    <span>⚠</span> {signupState.errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@domain.com"
                            className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        />
                        {signupState?.errors?.email && (
                            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                <span>⚠</span> {signupState.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                            Mobile number
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+880177788192"
                            type="tel"
                            className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        />
                        {signupState?.errors?.phoneNumber && (
                            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                <span>⚠</span> {signupState.errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        />
                        {signupState?.errors?.password && (
                            <div className="mt-1 text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-100">
                                <p className="font-semibold mb-1">Password must:</p>
                                <ul className="space-y-0.5 list-disc list-inside">
                                    {signupState.errors.password.map((error) => (
                                        <li key={error}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                            Re-type password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            // Dynamic border: changes to deep red border instantly if typing mismatched values
                            className={`w-full px-3 py-1.5 border rounded text-sm text-neutral-900 bg-white focus:outline-none transition-colors ${isMismatched
                                ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                : 'border-neutral-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                                }`}
                        />

                        {/* Instant client side error block */}
                        {isMismatched && (
                            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                                <span>⚠</span> Passwords do not match
                            </p>
                        )}

                        {/* Graceful fallback if server/action side errors catch validation edge cases */}
                        {signupState?.errors?.confirmPassword && !isMismatched && (
                            <div className="mt-1 text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-100">
                                <p className="font-semibold mb-1">Confirm Password must:</p>
                                <ul className="space-y-0.5 list-disc list-inside">
                                    {signupState.errors.confirmPassword.map((error) => (
                                        <li key={error}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Primary Button */}
                    <button
                        disabled={signupPending || isMismatched}
                        type="submit"
                        className="w-full mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-200 disabled:text-neutral-400 text-neutral-950 font-medium text-sm py-2 px-4 rounded shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {signupPending ? 'Creating account...' : 'Continue'}
                    </button>
                </form>

                <hr className="my-5 border-neutral-200" />

                {/* Footer Links */}
                <div className="text-xs text-neutral-600 space-y-3">
                    <p className="leading-normal">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-amber-700 hover:text-amber-800 hover:underline">Conditions of Use</a> and{' '}
                        <a href="#" className="text-amber-700 hover:text-amber-800 hover:underline">Privacy Notice</a>.
                    </p>
                    <p className="pt-3 border-t border-neutral-100">
                        Already have an account?{' '}
                        <a href="#" className="text-amber-700 hover:text-amber-800 hover:underline font-medium">Sign in ➔</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupForm