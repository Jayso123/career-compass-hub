import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2,
  Shield,
  Lock,
  Calendar,
  Clock,
  User,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", name: "UPI Payment", icon: Smartphone },
  { id: "netbanking", name: "Net Banking", icon: Building2 },
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingDetails = location.state;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI state
  const [upiId, setUpiId] = useState("");

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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    toast({
      title: "Payment Successful!",
      description: "Your mentorship session has been booked.",
    });
  };

  const isFormValid = () => {
    if (paymentMethod === "card") {
      return cardNumber.length >= 19 && expiryDate.length === 5 && cvv.length >= 3 && cardName.length > 0;
    }
    if (paymentMethod === "upi") {
      return upiId.includes("@");
    }
    return true;
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Select Payment Method
              </h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid sm:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <method.icon className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-foreground">
                        {method.name}
                      </span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </motion.div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Card Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* UPI Details */}
            {paymentMethod === "upi" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  UPI Payment
                </h2>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </motion.div>
            )}

            {/* Net Banking */}
            {paymentMethod === "netbanking" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Net Banking
                </h2>
                <p className="text-muted-foreground text-sm">
                  You will be redirected to your bank's secure portal to complete the payment.
                </p>
              </motion.div>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Shield className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 sticky top-24"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Booking Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mentor</p>
                    <p className="text-foreground font-medium">{mentor?.name}</p>
                    <p className="text-xs text-muted-foreground">{mentor?.expertise}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-foreground font-medium">{date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-foreground font-medium">{time}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-foreground font-medium">{plan?.name}</p>
                    <p className="text-xs text-muted-foreground">{plan?.description}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-highlight">{plan?.price}</span>
                </div>
              </div>

              <Button
                variant="highlight"
                size="lg"
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing || !isFormValid()}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Processing...
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
