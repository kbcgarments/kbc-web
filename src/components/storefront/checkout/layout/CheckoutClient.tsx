"use client";

import { useEffect, useState } from "react";

import {
  useAuthStore,
  useCartStore,
  useLanguageStore,
  useCurrencyStore,
} from "@/stores";
import type { Order, ShippingInfo, OrderPayload } from "@/types";

import { useCheckoutOrder, useStartPayment } from "@/hooks";

import AddressStep from "../steps/AddressStep";
import { Surface } from "./ui";
import OrderSummary from "../steps/OrderSummary";
import { Loader2 } from "lucide-react";

type Step = "address" | "summary";
function FixFlutterwaveIframeTitle() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector(
        'iframe[src*="flutterwave"]',
      ) as HTMLIFrameElement | null;

      if (iframe && !iframe.title) {
        iframe.title = "Secure payment checkout";
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

export default function CheckoutClient() {
  const { translate } = useLanguageStore();
  const { currency } = useCurrencyStore();
  const { isAuthenticated } = useAuthStore();
  const { id: cartId } = useCartStore();

  const [step, setStep] = useState<Step>("address");
  const [saveAddress, setSaveAddress] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "South Africa",
  });

  const [, setContact] = useState<{
    email: string;
  } | null>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [usingSavedAddress, setUsingSavedAddress] = useState(false);

  const checkoutOrder = useCheckoutOrder(cartId ?? "");
  const startPayment = useStartPayment();

  /* ==========================================
     ADDRESS STEP → STORE DATA → CREATE ORDER
  ========================================== */
  const handleAddressContinue = ({
    email,
    shipping,
  }: {
    email: string;
    shipping: ShippingInfo;
  }) => {
    setShippingInfo(shipping);
    setContact({ email });
    createOrder(email, shipping);
  };

  const createOrder = async (email: string, shipping: ShippingInfo) => {
    const payload: OrderPayload = {
      email,
      currency,
      shippingFullName: shipping.fullName,
      shippingPhone: shipping.phone,
      shippingStreet: shipping.street,
      shippingCity: shipping.city,
      shippingState: shipping.state || undefined,
      shippingPostal: shipping.postal || undefined,
      shippingCountry: shipping.country,
      saveAddress: isAuthenticated ? saveAddress : false,
    };
    const { order } = await checkoutOrder.mutateAsync(payload);
    setOrder(order);
    console.log(order);
    setStep("summary");
  };

  /* ==========================================
     SUMMARY STEP → START PAYMENT POPUP
  ========================================== */
  const handleProceedToPayment = async () => {
    if (!order) return;

    // Show modal
    setShowPaymentModal(true);

    try {
      const { paymentConfig } = await startPayment.mutateAsync({
        orderId: order.id,
      });

      window.FlutterwaveCheckout({
        ...paymentConfig,

        callback: function () {
          window.location.href = `/order/success/${order.orderNumber}`;
        },

        onclose: function () {
          setShowPaymentModal(false);
        },
      });
    } catch {
      setShowPaymentModal(false);
    }
  };

  return (
    <>
      <FixFlutterwaveIframeTitle />
      <Surface className="max-w-6xl lg:m-10 my-2">
        <div className="w-full flex items-center flex-col min-h-130">
          {/* HEADER */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">
              {translate("checkout.title")}
            </h1>
            <p className="text-secondary mt-1">
              {translate("checkout.subtitle")}
            </p>
          </header>

          <div className="w-full mx-auto grid lg:grid-cols-[1fr,350px] gap-6">
            <section className="space-y-6">
              {/* ADDRESS STEP */}
              {step === "address" && (
                <AddressStep
                  initialData={shippingInfo}
                  initialEmail=""
                  initialPhone=""
                  isSubmitting={checkoutOrder.isPending}
                  isUsingSavedAddress={usingSavedAddress}
                  onAddressChangeType={setUsingSavedAddress}
                  canSaveAddress={isAuthenticated}
                  saveAddress={saveAddress}
                  setSaveAddress={setSaveAddress}
                  onContinue={handleAddressContinue}
                />
              )}

              {/* SUMMARY STEP */}
              {step === "summary" && order && (
                <div className="p-6 border rounded-lg">
                  <OrderSummary orderId={order.id} />

                  <button
                    onClick={handleProceedToPayment}
                    disabled={showPaymentModal || startPayment.isPending}
                    className="w-full mt-4 py-3 bg-accent text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPaymentModal || startPayment.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      translate("checkout.actions.continue")
                    )}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </Surface>

      {/* Payment Loading Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {translate("checkout.modal.title")}
            </h3>
            <p className="text-gray-600 mb-4">
              {translate("checkout.modal.subtitle")}
            </p>
            <p className="text-sm text-gray-500">
              {translate("checkout.modal.description")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
