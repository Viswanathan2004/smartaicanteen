import { Button } from "@/components/ui/button";
import { generateQRCode } from "@/lib/utils";
import { useState } from "react";

export default function QRCodeSection() {
  const [qrCode, setQrCode] = useState("");
  const [tableNumber, setTableNumber] = useState("1");

  const handleGenerateQR = () => {
    const menuUrl = `${window.location.origin}/menu?table=${tableNumber}`;
    const qrCodeUrl = generateQRCode(menuUrl);
    setQrCode(qrCodeUrl);
  };

  return (
    <div className="bg-neutral-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="font-bold text-3xl mb-4">Scan & Order Instantly</h2>
            <p className="text-neutral-300 mb-6">
              No need to wait in line. Scan our QR code with your smartphone and browse the full menu from your table.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Browse the full menu on your device</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Place orders directly from your table</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Pay securely through your phone</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Track your order status in real-time</span>
              </li>
            </ul>

            <div className="flex items-center space-x-3">
              <select 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="bg-neutral-800 text-white rounded-lg px-3 py-2"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Table {num}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleGenerateQR}
                className="bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <rect x="7" y="7" width="3" height="3"></rect>
                    <rect x="14" y="7" width="3" height="3"></rect>
                    <rect x="7" y="14" width="3" height="3"></rect>
                    <rect x="14" y="14" width="3" height="3"></rect>
                  </svg>
                  <span>Generate Table QR</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/3 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              {qrCode ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <img src={qrCode} alt="QR Code for menu" className="w-full h-full" />
                </div>
              ) : (
                <div className="w-64 h-64 bg-white flex items-center justify-center">
                  <div className="border-4 border-neutral-900 w-48 h-48 flex flex-col items-center justify-center text-neutral-900">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mb-2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <rect x="7" y="7" width="3" height="3"></rect>
                      <rect x="14" y="7" width="3" height="3"></rect>
                      <rect x="7" y="14" width="3" height="3"></rect>
                      <rect x="14" y="14" width="3" height="3"></rect>
                    </svg>
                    <p className="text-sm font-medium">SmartCanteen Menu</p>
                    <p className="text-xs">Scan to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}