import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ForwardReceiptConfirmation } from "./ForwardReceiptConfirmation";
import { BackwardPaymentConfirmation } from "./BackwardPaymentConfirmation";

export function ContractPaymentConfirmation() {
  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="forward" className="w-full h-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="forward"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
          >
            前向收款确认
          </TabsTrigger>
          <TabsTrigger
            value="backward"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
          >
            后向付款确认
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forward" className="p-6 m-0">
          <ForwardReceiptConfirmation />
        </TabsContent>

        <TabsContent value="backward" className="p-6 m-0">
          <BackwardPaymentConfirmation />
        </TabsContent>
      </Tabs>
    </div>
  );
}