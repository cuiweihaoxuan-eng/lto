import React, { useState } from "react";
import { TabNav } from "./ui/TabNav";
import { ForwardReceiptConfirmation } from "./ForwardReceiptConfirmation";
import { BackwardPaymentConfirmation } from "./BackwardPaymentConfirmation";

export function ContractPaymentConfirmation() {
  const [activeTab, setActiveTab] = useState("forward");

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <TabNav
          tabs={[
            { id: "forward", label: "前向收款确认" },
            { id: "backward", label: "后向付款确认" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style="underlined"
        />

        <div className="mt-6">
          {activeTab === "forward" && <ForwardReceiptConfirmation />}
          {activeTab === "backward" && <BackwardPaymentConfirmation />}
        </div>
      </div>
    </div>
  );
}