/* eslint-disable @typescript-eslint/no-explicit-any */
import { TESTNET_CHAIN_ID } from "@/constant/value";

export function getWalletName(address: string) {
  const addressLength = address.length;
  const mid = Math.floor(addressLength / 2);

  return (
    address.substring(0, 4) +
    address.substring(mid, mid + 2) +
    address.substring(addressLength - 2)
  );
}

export async function getWalletChainId(wallet: any) {
  return await wallet.request({
    method: "eth_chainId",
    params: [],
  });
}

export async function switchToSeiTestnet(wallet: any) {
  return await wallet.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: TESTNET_CHAIN_ID,
      },
    ],
  });
}

export async function requestPermission(wallet: any) {
  return await wallet.request({
    method: "wallet_requestPermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
}

export async function getAccount(wallet: any) {
  const accounts = await wallet.request({
    method: "eth_accounts",
    params: [],
  });

  return accounts[0];
}

export async function revokePermission(wallet: any) {
  return await wallet.request({
    method: "wallet_revokePermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
}

export async function getBalance(wallet: any, account: string) {
  return await wallet?.request({
    method: "eth_getBalance",
    params: [account, "latest"],
  });
}
