"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Pencil,
  Save,
  X,
  CreditCard,
} from "lucide-react";

import {
  useAdminOrder,
  useUpdateOrderShipping,
  useUpdateOrderStatus,
} from "@/hooks";

import { OrderStatus, CancellationSource } from "@/types";
import type { UpdateOrderStatusPayload } from "@/types";
import { ALL_STATUSES } from "@/constants";

export function OrderDetailsClient({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const updateShipping = useUpdateOrderShipping();
  /* -------------------------------------
        STATUS UI STATE
  -------------------------------------- */
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );

  const [statusFields, setStatusFields] = useState<
    Partial<UpdateOrderStatusPayload>
  >({});

  const [statusNote, setStatusNote] = useState("");

  const statusRequires = useMemo(() => {
    switch (selectedStatus) {
      case OrderStatus.SHIPPED:
        return ["trackingNumber", "carrier", "estimatedDelivery"];

      case OrderStatus.OUT_FOR_DELIVERY:
        return ["outForDeliveryTime"];

      case OrderStatus.DELIVERED:
        return ["deliveredDate", "deliveredTime"];

      case OrderStatus.DELIVERY_FAILED:
        return ["failureReason", "nextAttemptDate"];

      case OrderStatus.DELIVERY_DELAYED:
        return ["delayReason", "newDeliveryDate"];

      case OrderStatus.CANCELLED:
        return ["cancelledBy", "cancellationReason", "refundAmount"];

      default:
        return [];
    }
  }, [selectedStatus]);

  const onSubmitStatus = () => {
    if (!selectedStatus) return;

    updateStatus.mutate({
      orderId: order!.id,
      data: {
        ...statusFields,
        status: selectedStatus,
        note: statusNote.trim(),
      } as UpdateOrderStatusPayload,
    });

    setStatusNote("");
    setStatusFields({});
    setSelectedStatus(null);
  };

  /* -------------------------------------
        SHIPPING UI STATE
  -------------------------------------- */
  const [editingShipping, setEditingShipping] = useState(false);
  const [shippingNote, setShippingNote] = useState("");

  const [shippingDraft, setShippingDraft] = useState({
    shippingFullName: "",
    shippingPhone: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostal: "",
    shippingCountry: "",
  });

  const startEditShipping = () => {
    setShippingDraft({
      shippingFullName: order!.shippingFullName,
      shippingPhone: order!.shippingPhone,
      shippingStreet: order!.shippingStreet,
      shippingCity: order!.shippingCity,
      shippingState: order!.shippingState ?? "",
      shippingPostal: order!.shippingPostal ?? "",
      shippingCountry: order!.shippingCountry,
    });
    setEditingShipping(true);
  };

  const saveShipping = () => {
    updateShipping.mutate({
      orderId: order!.id,
      ...shippingDraft,
      note:
        shippingNote ||
        "Shipping address updated by admin to ensure accurate delivery.",
    });

    setEditingShipping(false);
    setShippingNote("");
  };

  /* -------------------------------------
        LOADING
  -------------------------------------- */
  if (isLoading || !order) return <p>Loading order…</p>;

  /* -------------------------------------
        RENDER
  -------------------------------------- */
  return (
    <div className="max-w-8xl space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-tertiary">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-display font-bold">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-secondary">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ITEMS */}
          <div className="bg-secondary border border-primary rounded-xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <Package className="w-5 h-5" /> Items
            </h2>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-primary py-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.product.title_en}</p>
                  <p className="text-sm text-secondary">Qty {item.quantity}</p>
                </div>

                <p className="font-semibold">
                  {order.currency}{" "}
                  {(item.priceLocal * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* TIMELINE */}
          <div className="bg-secondary border border-primary rounded-xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <Clock className="w-5 h-5" /> Timeline
            </h2>

            {order.orderTimelines.map((t) => (
              <div key={t.id} className="mb-3">
                <p className="font-medium">{t.status.replaceAll("_", " ")}</p>
                {t.note && <p className="text-sm text-secondary">{t.note}</p>}
                <p className="text-xs text-tertiary">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* STATUS UPDATE */}
          <div className="bg-secondary border border-primary rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">Update Status</h3>

            <select
              title="select status"
              defaultValue={order.status}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2 border border-primary rounded-lg"
            >
              <option value="">— Select Status —</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            {/* CANCEL STATUS SPECIAL FIELDS */}
            {selectedStatus === OrderStatus.CANCELLED && (
              <>
                <select
                  title="select status"
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
                  value={statusFields.cancelledBy ?? ""}
                  onChange={(e) =>
                    setStatusFields({
                      ...statusFields,
                      cancelledBy: e.target.value as CancellationSource,
                    })
                  }
                >
                  <option value="">Select who cancelled</option>
                  <option value={CancellationSource.Customer}>Customer</option>
                  <option value={CancellationSource.Admin}>Admin</option>
                </select>

                <input
                  placeholder="Cancellation reason"
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
                  value={statusFields.cancellationReason ?? ""}
                  onChange={(e) =>
                    setStatusFields({
                      ...statusFields,
                      cancellationReason: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Refund amount"
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
                  value={statusFields.refundAmount ?? ""}
                  onChange={(e) =>
                    setStatusFields({
                      ...statusFields,
                      refundAmount: Number(e.target.value),
                    })
                  }
                />
              </>
            )}

            {/* GENERATED FIELDS */}
            {statusRequires.map((field) =>
              selectedStatus === OrderStatus.CANCELLED ? null : (
                <input
                  key={field}
                  placeholder={field}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
                  value={(statusFields as Record<string, string>)[field] ?? ""}
                  onChange={(e) =>
                    setStatusFields({
                      ...statusFields,
                      [field]: e.target.value,
                    })
                  }
                />
              ),
            )}

            <textarea
              placeholder="Optional note for customer"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
              className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
            />

            <button
              onClick={onSubmitStatus}
              className="w-full bg-accent text-white py-2 rounded-lg"
            >
              Update Status
            </button>
          </div>

          {/* ================= SHIPPING UPDATE ================= */}
          <div className="bg-secondary border border-primary rounded-xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Shipping
              </h3>

              {!editingShipping ? (
                <button
                  onClick={startEditShipping}
                  className="text-sm text-accent flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditingShipping(false)}
                  className="text-sm text-tertiary flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>

            {!editingShipping ? (
              <>
                <p>{order.shippingFullName}</p>
                <p className="text-sm">
                  {order.shippingStreet}, {order.shippingCity}
                </p>
                <p className="text-sm">{order.shippingCountry}</p>
              </>
            ) : (
              <>
                {Object.entries(shippingDraft).map(([key, value]) => (
                  <input
                    title="shipping input"
                    key={key}
                    value={value}
                    onChange={(e) =>
                      setShippingDraft({
                        ...shippingDraft,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-primary rounded-lg text-sm"
                  />
                ))}

                <textarea
                  placeholder="Optional internal note for shipping update"
                  value={shippingNote}
                  onChange={(e) => setShippingNote(e.target.value)}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />

                <button
                  onClick={saveShipping}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white rounded-lg py-2"
                >
                  <Save className="w-4 h-4" /> Save Shipping
                </button>
              </>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-secondary border border-primary rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-semibold mb-2">
              <CreditCard className="w-5 h-5" /> Payment
            </h3>
            <p className="text-sm">Provider: {order.paymentProvider}</p>
            <p className="text-sm">Currency: {order.currency}</p>
            <p className="text-sm">Total: {order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
