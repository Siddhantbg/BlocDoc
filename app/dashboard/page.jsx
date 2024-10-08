"use client";

import Upload from "@/components/upload";
import { useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { motion } from "framer-motion";

export default function Home() {
  const [account, setAccount] = useState(null);

  return (
    <>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 1.4, duration: 0.4, ease: "easeIn" }
      }}
      className="h-full w-full"
      >
      <div className="flex items-center justify-center mb-10">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <div className="px-4 py-2 text-sm font-medium text-gray-200 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700 flex flex-col items-center justify-center">
            <div>Wallet ID:</div>
            <div>{account ? `${account}` : "Not Connected"}</div>
          </div>
        </div>
      </div>
      {/* FILE UPLOAD SECTION */}
      <Upload />
      <div className="hidden">
        <ConnectWallet account={account} setAccount={setAccount} />
      </div>
      </motion.div>
    </>
  );
}