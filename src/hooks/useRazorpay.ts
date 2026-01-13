import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RazorpayOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: RazorpayResponse) => void;
  onError: (error: Error) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, []);

  const initiatePayment = useCallback(async (options: RazorpayOptions) => {
    if (!isScriptLoaded) {
      options.onError(new Error("Razorpay script not loaded"));
      return;
    }

    setIsLoading(true);

    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: options.amount,
          currency: options.currency || "INR",
          notes: options.notes,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create order");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const { orderId, keyId } = data;

      // Initialize Razorpay checkout
      const razorpay = new window.Razorpay({
        key: keyId,
        amount: options.amount * 100,
        currency: options.currency || "INR",
        name: options.name,
        description: options.description,
        order_id: orderId,
        prefill: options.prefill,
        notes: options.notes,
        theme: {
          color: "#8b5cf6",
        },
        handler: async (response: RazorpayResponse) => {
          // Verify payment on server
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError || !verifyData?.verified) {
              throw new Error("Payment verification failed");
            }

            options.onSuccess(response);
          } catch (err) {
            options.onError(err as Error);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      });

      razorpay.on("payment.failed", () => {
        options.onError(new Error("Payment failed"));
        setIsLoading(false);
      });

      razorpay.open();
    } catch (err) {
      options.onError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isScriptLoaded]);

  return {
    initiatePayment,
    isLoading,
    isScriptLoaded,
  };
};
