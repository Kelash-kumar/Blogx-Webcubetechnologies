import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Layout, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const registerSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    username: z.string().min(3, "Username is too short").regex(/^[a-zA-Z0-9_]+$/, "Alpha-numeric only"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "6+ characters required"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/register", data);
            if (response.data.success) {
                setIsSuccess(true);
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
                <Card className="max-w-sm w-full border-none shadow-xl rounded-[2.5rem] p-4 text-center bg-white">
                    <CardContent className="pt-10">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-2">Welcome Aboard!</h2>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-8">
                            Your account is ready
                        </p>
                        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full animate-progress-bar w-[60%] transition-all"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-10">
                <div className="text-center space-y-6">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <Layout className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-black text-foreground tracking-tighter">BlogX</span>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Create account</h1>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">Start your writing journey</p>
                    </div>
                </div>

                <Card className="border-gray-100/50 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                    <CardContent className="p-8 sm:p-12">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <p className="text-[11px] text-red-600 font-bold">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                        <Input
                                            {...register("name")}
                                            className="h-12 pl-11 bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Username</label>
                                    <Input
                                        {...register("username")}
                                        className="h-12 bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all"
                                        placeholder="@user"
                                    />
                                    {errors.username && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.username.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                    <Input
                                        {...register("email")}
                                        type="email"
                                        className="h-12 pl-11 bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Security</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        className="h-12 pl-11 bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-2xl font-black text-xs mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-8 justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Joined already?{" "}
                            <Link to="/login" className="text-primary hover:underline ml-1">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
