import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Store, Building2, Globe } from "lucide-react";
import { toast } from "sonner";

// UAE Emirates
const EMIRATES = [
  { value: 'dubai', label: 'Dubai', labelAr: 'دبي' },
  { value: 'abu_dhabi', label: 'Abu Dhabi', labelAr: 'أبو ظبي' },
  { value: 'sharjah', label: 'Sharjah', labelAr: 'الشارقة' },
  { value: 'ajman', label: 'Ajman', labelAr: 'عجمان' },
  { value: 'rak', label: 'Ras Al Khaimah', labelAr: 'رأس الخيمة' },
  { value: 'fujairah', label: 'Fujairah', labelAr: 'الفجيرة' },
  { value: 'uaq', label: 'Umm Al Quwain', labelAr: 'أم القيوين' },
];

// Business Types for UAE retail
const BUSINESS_TYPES = [
  { value: 'grocery', label: 'Grocery / Baqala', labelAr: 'بقالة' },
  { value: 'electronics', label: 'Electronics', labelAr: 'إلكترونيات' },
  { value: 'pharmacy', label: 'Pharmacy', labelAr: 'صيدلية' },
  { value: 'cafeteria', label: 'Cafeteria / Restaurant', labelAr: 'كافتيريا / مطعم' },
  { value: 'textile', label: 'Textile / Garments', labelAr: 'نسيج / ملابس' },
  { value: 'auto_parts', label: 'Auto Parts', labelAr: 'قطع غيار السيارات' },
  { value: 'general', label: 'General Trading', labelAr: 'تجارة عامة' },
];

// Common nationalities in UAE
const NATIONALITIES = [
  { value: 'emirati', label: 'Emirati (UAE National)' },
  { value: 'indian', label: 'Indian' },
  { value: 'pakistani', label: 'Pakistani' },
  { value: 'filipino', label: 'Filipino' },
  { value: 'bangladeshi', label: 'Bangladeshi' },
  { value: 'egyptian', label: 'Egyptian' },
  { value: 'lebanese', label: 'Lebanese' },
  { value: 'syrian', label: 'Syrian' },
  { value: 'jordanian', label: 'Jordanian' },
  { value: 'other', label: 'Other' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: "",
    password: "",
    // Step 2: Personal
    full_name: "",
    phone_number: "",
    nationality: "",
    // Step 3: Business
    business_name: "",
    emirate: "",
    business_type: "",
    trn: "", // Tax Registration Number (optional)
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.email.includes("@")) {
        toast.error("Please enter a valid email");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }
    if (step === 2) {
      if (!formData.full_name || !formData.phone_number) {
        toast.error("Please fill all required fields");
        return;
      }
      // UAE phone validation: +971 followed by 9 digits or just 9-10 digits
      const phoneClean = formData.phone_number.replace(/\D/g, '');
      if (phoneClean.length < 9 || phoneClean.length > 12) {
        toast.error("Please enter a valid UAE phone number");
        return;
      }
      if (!formData.nationality) {
        toast.error("Please select your nationality");
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!formData.business_name || !formData.emirate || !formData.business_type) {
      toast.error("Please fill all required business fields");
      return;
    }

    // Validate TRN if provided (15 digits starting with 100)
    if (formData.trn && formData.trn.length > 0) {
      const trnClean = formData.trn.replace(/\D/g, '');
      if (trnClean.length !== 15 || !trnClean.startsWith('100')) {
        toast.error("TRN must be 15 digits starting with 100");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone_number: formData.phone_number.replace(/\D/g, ''),
        nationality: formData.nationality,
        is_emirati: formData.nationality === 'emirati',
        emirate: formData.emirate,
        business_name: formData.business_name,
        business_type: formData.business_type,
        trn: formData.trn ? formData.trn.replace(/\D/g, '') : '',
      });

      toast.success(`Welcome ${formData.full_name}! 🎉`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Signup failed";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
          {/* Logo/Branding */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              StoreBuddy
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-emerald-500" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                  <p className="text-muted-foreground">Start managing your business smarter</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
                  <p className="text-muted-foreground">Tell us about yourself</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Mohammed Ahmed"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number (UAE)</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 bg-muted rounded-lg text-sm">
                        +971
                      </div>
                      <Input
                        type="tel"
                        placeholder="50 123 4567"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({ ...formData, phone_number: e.target.value.slice(0, 12) })
                        }
                        className="h-12 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Select value={formData.nationality} onValueChange={(v) => setFormData({ ...formData, nationality: v })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATIONALITIES.map((nat) => (
                          <SelectItem key={nat.value} value={nat.value}>
                            {nat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Business Information</h2>
                  <p className="text-muted-foreground">Help us customize your experience</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Business Name
                    </Label>
                    <Input
                      placeholder="Al Noor Trading LLC"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Emirate
                    </Label>
                    <Select value={formData.emirate} onValueChange={(v) => setFormData({ ...formData, emirate: v })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select emirate" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMIRATES.map((em) => (
                          <SelectItem key={em.value} value={em.value}>
                            {em.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Business Type
                    </Label>
                    <Select value={formData.business_type} onValueChange={(v) => setFormData({ ...formData, business_type: v })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((bt) => (
                          <SelectItem key={bt.value} value={bt.value}>
                            {bt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      TRN (Tax Registration Number) - Optional
                    </Label>
                    <Input
                      placeholder="100XXXXXXXXXXXX"
                      value={formData.trn}
                      onChange={(e) => setFormData({ ...formData, trn: e.target.value.slice(0, 15) })}
                      className="h-12"
                      maxLength={15}
                    />
                    <p className="text-xs text-muted-foreground">
                      15 digits starting with 100. Required if VAT registered.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)} 
                className="flex-1 h-12"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 mr-2" />
                    Start Using StoreBuddy
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Already have account link */}
          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-emerald-600 hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          )}

          {/* Step indicator */}
          <div className="text-center text-xs text-muted-foreground mt-4">
            Step {step} of 3
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
