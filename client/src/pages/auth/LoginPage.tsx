import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(data);
            if (response.success) {
                login(response.data);
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-lg shadow-sm">
                            <Layout className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-black text-foreground">BlogX</span>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black tracking-tight text-foreground">Welcome back</h1>
                        <p className="text-sm text-muted-foreground font-medium">Continue your writing journey</p>
                    </div>
                </div>

                <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardContent className="p-8">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-destructive" />
                                    <p className="text-[12px] text-destructive font-bold">{error}</p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("email")}
                                        type="email"
                                        className="pl-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-[11px] text-destructive font-bold ml-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Password</label>
                                    <Link to="#" className="text-[10px] font-black text-primary hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        className="pl-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-[11px] text-destructive font-bold ml-1">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-xl font-bold text-sm mt-4 shadow-md shadow-primary/10"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 justify-center">
                        <p className="text-xs text-muted-foreground font-medium">
                            New here?{" "}
                            <Link to="/register" className="font-bold text-primary hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-[11px] text-muted-foreground font-medium">
                    Protected by BlogX Security. Terms & Privacy apply.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
