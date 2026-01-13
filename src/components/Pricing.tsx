import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingModal, { PlanDetails } from "@/components/BookingModal";

const plans: PlanDetails[] = [
  {
    name: "Basic",
    price: "₹299",
    period: "per session",
    description: "Perfect for students seeking quick career clarity",
    features: [
      "30-minute 1:1 video call",
      "Career path exploration",
      "Basic skill assessment",
      "Email follow-up support",
      "Resource recommendations",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "₹699",
    period: "per session",
    description: "Comprehensive guidance for serious career planning",
    features: [
      "60-minute 1:1 video call",
      "Personalized career roadmap",
      "Resume review & optimization",
      "LinkedIn profile audit",
      "2 weeks email support",
      "Action plan document",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹1,199",
    period: "per month",
    description: "Complete mentorship for career transformation",
    features: [
      "4 x 60-minute video calls",
      "Full career strategy plan",
      "Resume & cover letter creation",
      "Mock interview sessions",
      "Unlimited chat support",
      "Industry connections intro",
      "Job application guidance",
    ],
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);

  const handleBookSession = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <>
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan} 
      />
    <section id="pricing" className="section-padding bg-background">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-highlight/10 text-highlight text-sm font-medium mb-4">
            Pricing Plans
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Invest in Your <span className="text-highlight">Future</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Affordable mentorship plans designed for students. Choose the level
            of guidance that fits your needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative rounded-2xl bg-card border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-accent shadow-lg scale-105 md:scale-110"
                  : "border-border hover:border-accent/30"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold shadow-md">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Plan Header */}
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl lg:text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? "highlight" : "accent"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleBookSession(plan)}
                >
                  Book Session
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          All plans include a satisfaction guarantee. Not happy? We'll make it right.
        </motion.p>
      </div>
    </section>
    </>
  );
};

export default Pricing;