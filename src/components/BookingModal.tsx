import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mentors = [
  { id: "1", name: "Priya Sharma", expertise: "Tech & IT Careers", experience: "8+ years" },
  { id: "2", name: "Rahul Verma", expertise: "Business & Finance", experience: "10+ years" },
  { id: "3", name: "Ananya Gupta", expertise: "Healthcare & Medicine", experience: "12+ years" },
  { id: "4", name: "Vikram Singh", expertise: "Creative Industries", experience: "7+ years" },
  { id: "5", name: "Sneha Patel", expertise: "Engineering & Manufacturing", experience: "9+ years" },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export interface PlanDetails {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails | null;
}

const BookingModal = ({ isOpen, onClose, plan }: BookingModalProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [mentor, setMentor] = useState<string>("");
  const [step, setStep] = useState(1);

  const isFormComplete = date && time && mentor;

  const handleProceedToPayment = () => {
    if (isFormComplete && plan) {
      const bookingDetails = {
        date: format(date, "PPP"),
        time,
        mentor: mentors.find(m => m.id === mentor),
        plan,
      };
      navigate("/payment", { state: bookingDetails });
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setDate(undefined);
    setTime("");
    setMentor("");
    setStep(1);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const selectedMentor = mentors.find(m => m.id === mentor);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary to-primary/80">
          <DialogTitle className="text-xl font-display text-primary-foreground">
            Book Your Mentorship Session
          </DialogTitle>
          {plan && (
            <p className="text-primary-foreground/80 text-sm mt-1">
              {plan.name} Plan - {plan.price}
            </p>
          )}
        </DialogHeader>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-1 mx-2 rounded",
                      step > s ? "bg-accent" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Select Mentor</span>
            <span>Choose Date</span>
            <span>Pick Time</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Mentor */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-accent" />
                  Select Your Mentor
                </label>
                <Select value={mentor} onValueChange={setMentor}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Choose a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {m.expertise} • {m.experience}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMentor && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <p className="font-medium text-foreground">{selectedMentor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMentor.expertise} • {selectedMentor.experience}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Select Date */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CalendarIcon className="w-4 h-4 text-accent" />
                  Select Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {date && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-highlight/10 border border-highlight/20"
                  >
                    <p className="text-sm text-foreground">
                      Selected: <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Select Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="w-4 h-4 text-accent" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={time === slot ? "accent" : "outline"}
                      size="sm"
                      onClick={() => setTime(slot)}
                      className="h-10"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>

                {time && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <p className="text-sm text-foreground">
                      Selected time: <span className="font-medium">{time}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary when all steps complete */}
          {step === 3 && isFormComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-muted/50 border border-border space-y-2"
            >
              <h4 className="font-medium text-foreground">Booking Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>👤 Mentor: {selectedMentor?.name}</p>
                <p>📅 Date: {date && format(date, "EEEE, MMMM d, yyyy")}</p>
                <p>⏰ Time: {time}</p>
                <p>📋 Plan: {plan?.name} - {plan?.price}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-0 flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          
          {step < 3 && (
            <Button
              variant="accent"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !mentor : !date}
              className="flex-1"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {step === 3 && (
            <Button
              variant="highlight"
              onClick={handleProceedToPayment}
              disabled={!isFormComplete}
              className="flex-1"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
