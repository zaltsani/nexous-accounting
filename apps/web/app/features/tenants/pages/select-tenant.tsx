import { useState } from "react";
import { useGetTenantList } from "../hooks/use-get-list-tenants";
import { useSelectTenant } from "../hooks/use-select-tenant";
import { Button } from "@nexous-accounting/ui";

export function meta() {
  return [
    { title: "Tenants" },
    { name: "description", content: "Select tenant to starts with." },
  ];
}

export default function () {
  const { data: tenantsData } = useGetTenantList();
  const selectTenantMutation = useSelectTenant();

  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const handleSelectTenantSubmit = () => {
    if (!selectedTenantId) return;
    selectTenantMutation.mutate(selectedTenantId)
  }

  console.log({ tenantsData });

  return (
    <div className="grid gap-8 py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-4 md:gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">Tenants</h1>
        <p className="text-sm text-accent-foreground tracking-tight">Pilih Tenants</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tenantsData?.map((member, index) => (
          <div key={index} onClick={() => setSelectedTenantId(member.tenant.id)}>
            <div>{member.tenant.name}</div>
            <div>{member.role}</div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleSelectTenantSubmit}
      >
        Pilih Tenant
      </Button>
    </div>
  )
}