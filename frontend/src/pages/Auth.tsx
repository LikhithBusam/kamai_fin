import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Store, TrendingUp, Shield, Receipt } from "lucide-react";
import { toast } from "sonner";

// UAE Emirates
const EMIRATES = [
  { value: 'dubai', label: 'Dubai' },
  { value: 'abu_dhabi', label: 'Abu Dhabi' },
  { value: 'sharjah', label: 'Sharjah' },
  { value: 'ajman', label: 'Ajman' },
  { value: 'rak', label: 'Ras Al Khaimah' },
  { value: 'fujairah', label: 'Fujairah' },
  { value: 'uaq', label: 'Umm Al Quwain' },
];

// Business Types
const BUSINESS_TYPES = [
  { value: 'grocery', label: 'Grocery / Baqala' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'cafeteria', label: 'Cafeteria / Restaurant' },
  { value: 'textile', label: 'Textile / Garments' },
  { value: 'auto_parts', label: 'Auto Parts' },
  { value: 'general', label: 'General Trading' },
];

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useApp();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    preferred_language: "en",
    business_name: "",
    business_type: "",
    emirate: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setIsLoading(true);
      await login(loginData.email, loginData.password);
      toast.success("Login successful!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Login failed";
      // Check for email confirmation issue
      if (errorMsg.includes('confirm') || errorMsg.includes('Email not confirmed')) {
        toast.info("Please check your email and click the confirmation link first.", { duration: 8000 });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.full_name || !signupData.email || !signupData.password || !signupData.business_name || !signupData.emirate) {
      toast.error("Please fill all required fields");
      return;
    }
    if (signupData.password !== signupData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setIsLoading(true);
      await signup({
        full_name: signupData.full_name,
        phone_number: signupData.phone_number || "",
        email: signupData.email,
        password: signupData.password,
        business_name: signupData.business_name,
        business_type: signupData.business_type || "general",
        emirate: signupData.emirate,
      });
      toast.success("Account created successfully!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Signup failed";
      // Show email confirmation message as info, not error
      if (errorMsg.includes('check your email') || errorMsg.includes('confirm')) {
        toast.info(errorMsg, { duration: 8000 });
        // Switch to login tab after showing the message
        setActiveTab("login");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Store, text: "Smart Inventory & Sales" },
    { icon: TrendingUp, text: "Revenue Analytics" },
    { icon: Shield, text: "UAE VAT Compliance" },
    { icon: Receipt, text: "Expense Tracking" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Brand Explanation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block space-y-6"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-4">
              StoreBuddy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your smart retail companion for UAE shop owners. AI-powered insights for small business success.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-4 shadow-lg border border-slate-200"
              >
                <Icon className="w-6 h-6 text-slate-700 mb-2" />
                <p className="text-sm font-medium text-slate-900">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Auth Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                  <p className="text-muted-foreground">Login to your StoreBuddy account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button className="text-sm text-slate-600 hover:text-slate-900 hover:underline">Forgot password?</button>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                  <p className="text-muted-foreground">Start growing your business with StoreBuddy</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Ahmed Khan"
                      value={signupData.full_name}
                      onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={signupData.phone_number}
                      onChange={(e) => setSignupData({ ...signupData, phone_number: e.target.value })}
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-business">Business Name *</Label>
                    <Input
                      id="signup-business"
                      type="text"
                      placeholder="Al Baraka Grocery"
                      value={signupData.business_name}
                      onChange={(e) => setSignupData({ ...signupData, business_name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-type">Business Type *</Label>
                    <Select
                      value={signupData.business_type}
                      onValueChange={(v) => setSignupData({ ...signupData, business_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-emirate">Emirate *</Label>
                    <Select
                      value={signupData.emirate}
                      onValueChange={(v) => setSignupData({ ...signupData, emirate: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select emirate" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMIRATES.map((emirate) => (
                          <SelectItem key={emirate.value} value={emirate.value}>{emirate.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password *</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirm_password}
                      onChange={(e) => setSignupData({ ...signupData, confirm_password: e.target.value })}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-language">Preferred Language</Label>
                    <Select
                      value={signupData.preferred_language}
                      onValueChange={(v) => setSignupData({ ...signupData, preferred_language: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

