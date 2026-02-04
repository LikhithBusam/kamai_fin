// StoreBuddy - UAE Benefits & Programs Page
// Redirects to UAE Programs for business support and funding

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building2, 
  ArrowRight, 
  Sparkles,
  Award,
  Landmark,
  Briefcase,
  GraduationCap,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import PageIntro from "@/components/PageIntro";

const Benefits = () => {
  const navigate = useNavigate();

  // UAE Business Support Programs
  const uaePrograms = [
    {
      name: "Dubai SME",
      description: "Dubai's agency for entrepreneurship development",
      icon: Building2,
      color: "bg-blue-500",
      features: ["Business incubation", "Funding up to AED 500K", "Training programs"],
      link: "/uae-programs"
    },
    {
      name: "Khalifa Fund",
      description: "Abu Dhabi's leading funding organization for SMEs",
      icon: Landmark,
      color: "bg-emerald-500",
      features: ["Micro loans", "Direct finance", "Al Bedaya funding"],
      link: "/uae-programs"
    },
    {
      name: "RAKCEZ",
      description: "Ras Al Khaimah Economic Zone programs",
      icon: Briefcase,
      color: "bg-purple-500",
      features: ["Free zone licenses", "Business setup", "100% ownership"],
      link: "/uae-programs"
    },
    {
      name: "Sharjah Chamber",
      description: "Sharjah business support and development",
      icon: Award,
      color: "bg-orange-500",
      features: ["Trade facilitation", "Export support", "Business matching"],
      link: "/uae-programs"
    }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Business Benefits
            </h1>
            <p className="text-muted-foreground">UAE funding programs and business support</p>
          </div>
        </div>
        <Button onClick={() => navigate("/uae-programs")} className="bg-emerald-600 hover:bg-emerald-700">
          <Award className="w-4 h-4 mr-2" />
          View All Programs
        </Button>
      </div>

      <PageIntro
        title="UAE Business Support"
        description="Explore government-backed funding programs, business incubators, and support services designed specifically for UAE small businesses and entrepreneurs."
      />

      {/* Featured Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uaePrograms.map((program, idx) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(program.link)}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${program.color}`}>
                  <program.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{program.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                  <div className="space-y-1">
                    {program.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Grow Your Business with UAE Support</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            The UAE government offers extensive support for small businesses through various funding programs, 
            training initiatives, and business development services across all emirates.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/uae-programs")} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Award className="w-5 h-5 mr-2" />
              Explore All Programs
            </Button>
            <Button onClick={() => navigate("/business-health")} size="lg" variant="outline">
              <GraduationCap className="w-5 h-5 mr-2" />
              Check Business Health
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/uae-programs")}>
          <Landmark className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-medium text-sm">Funding</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/credit-book")}>
          <Briefcase className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-medium text-sm">Credit Book</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/vat")}>
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="font-medium text-sm">VAT Help</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/business-health")}>
          <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="font-medium text-sm">Business Health</p>
        </Card>
      </div>
    </div>
  );
};

export default Benefits;


