import React from "react";
import BarcodedPacketScan from "@/components/dashboard/order/barcodePacketScan";
import { config } from "@/config";
export const metadata = {
  title: `Barcode Scan | Dashboard | ${config.site.name}`,
  description: "Scan barcoded packets for order processing",
};

export default function BarcodeScanPage(): React.JSX.Element {
  return (
    <div>
      <BarcodedPacketScan />
    </div>
  );
}