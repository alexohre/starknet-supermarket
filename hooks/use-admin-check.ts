import { useEffect, useState } from 'react';
import { useAccount, useCall } from '@starknet-react/core';
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from '@/lib/contracts';


export function useAdminCheck() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the useCall hook to check admin status
  const { data, error: callError } = useCall({
    abi: SUPERMARKET_ABI,
    functionName: "is_owner_or_admin",
    address: SUPERMARKET_CONTRACT_ADDRESS,
    args: address ? [address] : [],
  });

  useEffect(() => {
    console.log('useAdminCheck effect running', { 
      isConnected, 
      address, 
      data, 
      callError
    });

    // Reset admin status when disconnected
    if (!isConnected || !address) {
      console.log('Not connected or no address, setting isAdmin to false');
      setIsAdmin(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Keep loading until we get data or an error
    if (data === undefined && !callError) {
      console.log('Still waiting for data, keeping isLoading true');
      setIsLoading(true);
      return;
    }

    // Update loading state
    setIsLoading(false);

    // Update error state
    if (callError) {
      console.error('Error checking admin status:', callError);
      setError(callError instanceof Error ? callError : new Error('Unknown error checking admin status'));
      setIsAdmin(false);
      return;
    }

    // Check if we have data and update admin status
    if (data !== undefined) {
      // The is_admin function returns a boolean
      // In Starknet, this is typically represented as 0 (false) or 1 (true)
      console.log('Received data from contract:', data);
      
      // Handle different possible return formats from the contract
      let adminStatus = false;
      
      if (data === true) {
        adminStatus = true;
      } else if (typeof data === 'bigint') {
        adminStatus = data === BigInt(1);
      } else if (data === '1') {
        adminStatus = true;
      } else if (Array.isArray(data)) {
        // Check if the array contains a boolean or a value that can be interpreted as true
        adminStatus = data[0] === true || data[0] === 1 || data[0] === '1';
      } else if (typeof data === 'object' && data !== null) {
        // Handle the case where data might be an object with a specific structure
        // This is common in Starknet where enums like Bool can be returned as objects
        const dataStr = JSON.stringify(data).toLowerCase();
        adminStatus = dataStr.includes('true') || dataStr.includes('"1"');
      }
      
      console.log('Calculated adminStatus:', adminStatus);
      setIsAdmin(adminStatus);
    } else {
      console.log('No data received from contract yet');
    }
  }, [data, isConnected, address, callError]);

  return { isAdmin, isLoading, error };
}
