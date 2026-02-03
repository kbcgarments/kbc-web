import { TrackOrderClient } from "@/components/storefront/orders/layout/TrackOrderClient";
import BreadCrumb, { BreadCrumbItem } from "@/components/ui/layout/BreadCrumb";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const breadcrumbItems: BreadCrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Track Order", href: "/order/track" },
    { label: `${orderNumber}` },
  ];
  return (
    <div className="min-h-fit bg-primary pb-20">
      <div className="max-w-7xl mx-auto  flex flex-col space-y-4">
        <BreadCrumb items={breadcrumbItems} />
        <TrackOrderClient orderNumber={orderNumber} />
      </div>
    </div>
  );
}
