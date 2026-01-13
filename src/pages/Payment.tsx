import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2,
  Shield,
  Lock,
  Calendar,
  Clock,
  User,
  Package,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingDetails = location.state;
  const { initiatePayment, isLoading, isScriptLoaded } = useRazorpay();

  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId?: string;
    orderId?: string;
  }>({});

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No booking details found</h1>
          <Button onClick={() => navigate("/")} variant="accent">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const { date, time, mentor, plan } = bookingDetails;

  // Parse price to get numeric value (e.g., "₹2,999" -> 2999)
  const parsePrice = (priceString: string): number => {
    const numericValue = priceString.replace(/[^\d]/g, "");
    return parseInt(numericValue, 10) || 0;
  };

  const handlePayment = async () => {
    const amount = parsePrice(plan?.price || "0");
    
    if (amount === 0) {
      toast({
        title: "Error",
        description: "Invalid price amount",
        variant: "destructive",
      });
      return;
    }

    initiatePayment({
      amount,
      currency: "INR",
      name: "CareerBoost Mentorship",
      description: `${plan?.name} - Session with ${mentor?.name}`,
      notes: {
        mentorName: mentor?.name || "",
        planName: plan?.name || "",
        sessionDate: date || "",
        sessionTime: time || "",
      },
      onSuccess: (response) => {
        setPaymentDetails({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
        setIsSuccess(true);
        toast({
          title: "Payment Successful!",
          description: "Your mentorship session has been booked.",
        });
      },
      onError: (error) => {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your mentorship session with {mentor?.name} has been scheduled for {date} at {time}.
          </p>
          <div className="p-6 rounded-xl bg-card border border-border mb-8 text-left">
            <h3 className="font-medium text-foreground mb-4">Session Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Mentor:</span>
                <span className="text-foreground font-medium">{mentor?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground font-medium">{time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Plan:</span>
                <span className="text-foreground font-medium">{plan?.name}</span>
              </div>
              {paymentDetails.paymentId && (
                <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="text-foreground font-medium text-xs">{paymentDetails.paymentId}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email with meeting details will be sent to you shortly.
          </p>
          <Button onClick={() => navigate("/")} variant="accent" size="lg" className="w-full">
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary py-6 px-4">
        <div className="container-main">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-display font-bold text-primary-foreground">
            Complete Your Payment
          </h1>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Booking Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Mentor</p>
                  <p className="text-foreground font-medium">{mentor?.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor?.expertise}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-foreground font-medium">{date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-foreground font-medium">{time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-foreground font-medium">{plan?.name}</p>
                  <p className="text-xs text-muted-foreground">{plan?.description}</p>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            {plan?.features && plan.features.length > 0 && (
              <div className="border-t border-border pt-4 mb-6">
                <p className="text-sm font-medium text-foreground mb-3">What's Included:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center text-xl">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-bold text-highlight">{plan?.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Payment Info Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-accent mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Secure Payment via Razorpay
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets
                </p>
              </div>

              {/* Payment Methods Icons */}
              <div className="flex flex-wrap justify-center gap-4 mb-6 py-4 border-y border-border">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cards</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <span className="text-xs font-semibold text-muted-foreground">UPI</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Net Banking</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Wallets</span>
                </div>
              </div>

              <Button
                variant="highlight"
                size="lg"
                className="w-full"
                onClick={handlePayment}
                disabled={isLoading || !isScriptLoaded}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : !isScriptLoaded ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Pay {plan?.price}
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By proceeding, you agree to our Terms of Service and Refund Policy
              </p>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Shield className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your payment is secured with 256-bit SSL encryption via Razorpay's PCI-DSS compliant gateway.
              </p>
            </div>

            {/* Razorpay Trust Badge */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Powered by <span className="font-semibold">Razorpay</span> - India's trusted payment gateway
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
