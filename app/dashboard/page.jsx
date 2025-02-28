"use client";

import { useState, useEffect } from "react";
import Upload from "@/components/upload";
import ConnectWallet from "@/components/ConnectWallet";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle component mounting for client-side rendering
  useEffect(() => {
    setIsMounted(true);
    setIsLoading(false);
  }, []);

  // Format wallet address for display
  const formatWalletDisplay = (address) => {
    if (!address) return "Not Connected";
    // Format for display: first 6 + "..." + last 4 characters
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Avoid hydration errors by not rendering until component is mounted
  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.8, duration: 0.6, ease: "easeInOut" }
      }}
      className="h-full w-full max-w-6xl mx-auto px-4"
    >
      {/* Wallet Status Section */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0, transition: { delay: 1.2, duration: 0.4 } }}
        className="flex items-center justify-center mb-10"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div 
            className="rounded-lg border border-gray-800 bg-gray-950 p-4 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-gray-400">Wallet Status</div>
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="text-gray-200 font-mono tracking-tight truncate max-w-xs">
                  {formatWalletDisplay(account)}
                </div>
              )}
            </div>
          </div>
          
          <div className="sm:ml-2">
            <ConnectWallet account={account} setAccount={setAccount} />
          </div>
        </div>
      </motion.div>

      {/* File Upload Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          transition: { delay: 1.6, duration: 0.5 } 
        }}
      >
        <Upload account={account} />
      </motion.div>
    </motion.div>
  );
}