import { useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/toast'; // Assuming you have a toast component

const ConnectWallet = ({ account, setAccount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [networkName, setNetworkName] = useState('');

  // Network IDs to human-readable names
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0x5': 'Goerli Testnet',
    '0x89': 'Polygon',
    '0x13881': 'Mumbai Testnet',
    '0xa86a': 'Avalanche',
    '0xa': 'Optimism',
    '0xa4b1': 'Arbitrum'
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Handle account changes from MetaMask
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      toast?.({
        title: 'Disconnected',
        description: 'Wallet has been disconnected',
        variant: 'warning'
      });
    } else {
      setAccount(accounts[0]);
      getNetworkInfo();
    }
  }, [setAccount]);

  // Handle network changes
  const handleChainChanged = useCallback(() => {
    // Reload the page on chain change as recommended by MetaMask
    window.location.reload();
  }, []);

  // Get network information
  const getNetworkInfo = useCallback(async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetworkName(networks[chainId] || `Chain ID: ${chainId}`);
      } catch (error) {
        console.error("Failed to get network information:", error);
      }
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getNetworkInfo();
        }
      } catch (error) {
        console.error("An error occurred while checking the wallet connection:", error);
        toast?.({
          title: 'Connection Error',
          description: 'Failed to check wallet connection',
          variant: 'destructive'
        });
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsLoading(true);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        getNetworkInfo();
        
        toast?.({
          title: 'Connected',
          description: 'Wallet connected successfully',
          variant: 'success'
        });
      } catch (error) {
        console.error("An error occurred while connecting the wallet:", error);
        
        // Provide more helpful error messages based on error type
        if (error.code === 4001) {
          toast?.({
            title: 'Connection Rejected',
            description: 'You rejected the connection request',
            variant: 'warning'
          });
        } else {
          toast?.({
            title: 'Connection Failed',
            description: 'Failed to connect to your wallet',
            variant: 'destructive'
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast?.({
        title: 'MetaMask Required',
        description: 'Please install MetaMask browser extension',
        variant: 'warning'
      });
    }
  };

  // Format account address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={connectWallet}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 ${
          account 
            ? 'bg-accent text-primary hover:bg-accent-hover' 
            : 'bg-red text-primary hover:bg-red-hover'
        }`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>Connecting...</span>
          </>
        ) : account ? (
          `Connected: ${formatAddress(account)}`
        ) : (
          "Connect Wallet"
        )}
      </Button>
      
      {account && networkName && (
        <span className="text-xs text-gray-500">
          {networkName}
        </span>
      )}
    </div>
  );
};

export default ConnectWallet;