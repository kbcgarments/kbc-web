import Script from "next/script";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        id="flwpgpaid"
        strategy="afterInteractive"
      />

      <div className="bg-primary min-h-screen">{children}</div>
    </>
  );
}
