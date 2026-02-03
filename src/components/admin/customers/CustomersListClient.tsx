"use client";

import { useState, useMemo } from "react";
import { Search, UserX, RotateCcw, Mail, Phone } from "lucide-react";

import {
  useAdminCustomers,
  useAdminDeactivateCustomer,
  useAdminReactivateCustomer,
} from "@/hooks";

import { Customer } from "@/types";

type StatusFilter = "all" | "active" | "deactivated";

/* ======================================================
   COMPONENT
====================================================== */

export function CustomersListClient() {
  const { data: customers = [], isLoading } = useAdminCustomers();
  const deactivateCustomer = useAdminDeactivateCustomer();
  const reactivateCustomer = useAdminReactivateCustomer();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  /* ----------------------------------------------------
     FILTERING (deletedAt is the source of truth)
  ---------------------------------------------------- */
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: Customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const isActive = customer.deletedAt === null;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? isActive
            : !isActive;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  /* ----------------------------------------------------
     ACTIONS
  ---------------------------------------------------- */
  const handleDeactivate = (id: string, name?: string | null) => {
    if (
      !confirm(
        `Deactivate ${name ?? "this customer"}?\n\nThey will no longer be able to log in.`,
      )
    )
      return;

    deactivateCustomer.mutate(id);
  };

  const handleReactivate = (id: string, name?: string | null) => {
    if (
      !confirm(
        `Reactivate ${name ?? "this customer"}?\n\nThey will regain access to their account.`,
      )
    )
      return;

    reactivateCustomer.mutate(id);
  };

  /* ----------------------------------------------------
     RENDER
  ---------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Customers
        </h1>
        <p className="text-secondary">
          Manage active and deactivated customer accounts
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-secondary border border-primary rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* SEARCH */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 bg-primary border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 bg-primary border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-secondary border border-primary rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tertiary">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold">
                  Joined
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-secondary">
                    Loading customers…
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-secondary">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const isActive = customer.deletedAt === null;

                  return (
                    <tr
                      key={customer.id}
                      className="border-t border-primary hover:bg-tertiary transition-colors"
                    >
                      {/* NAME */}
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-primary">
                          {customer.name ?? "—"}
                        </p>
                      </td>

                      {/* CONTACT */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-secondary">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>

                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-secondary">
                              <Phone className="w-3 h-3" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* JOINED */}
                      <td className="py-3 px-4">
                        <p className="text-sm text-secondary">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* DEACTIVATE */}
                          <button
                            onClick={() =>
                              handleDeactivate(customer.id, customer.name)
                            }
                            disabled={!isActive || deactivateCustomer.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Deactivate customer"
                          >
                            <UserX className="w-4 h-4" />
                          </button>

                          {/* REACTIVATE */}
                          <button
                            onClick={() =>
                              handleReactivate(customer.id, customer.name)
                            }
                            disabled={isActive || reactivateCustomer.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Reactivate customer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-sm text-secondary">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>
    </div>
  );
}
