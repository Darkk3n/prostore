'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, { success: false, message: '' });
    return (
        <form action={action}>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        defaultValue={signInDefaultValues.email}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Pasword</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="password"
                        defaultValue={signInDefaultValues.password}
                    />
                </div>
                <div>
                    <Button
                        className="w-full"
                        variant="default"
                    >
                        Sign In
                    </Button>
                </div>
                {data && !data.success && <div className="text-destructive">{data.message}</div>}
                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        target="_self"
                        className="link"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default CredentialsSignInForm;
