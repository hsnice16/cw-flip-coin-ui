import {
  CW_DECIMALS,
  CW_FLIP_COIN_CONTRACT,
  DEFAULT_HISTORY_LOG_LIMIT,
  FLIP_EVM_DECIMALS,
} from "@/constant/value";

import { Contract, toUtf8Bytes, toUtf8String } from "ethers";

async function queryContract(contract: Contract, queryMsg: string) {
  const queryResponse = await contract.query(
    CW_FLIP_COIN_CONTRACT,
    toUtf8Bytes(queryMsg)
  );

  const parsedResponse = JSON.parse(toUtf8String(queryResponse));
  return parsedResponse;
}

export async function getPauseStatus(contract: Contract | undefined) {
  if (!contract) {
    return false;
  }

  const queryMsg = { pause: {} };
  const parsedResponse = await queryContract(
    contract,
    JSON.stringify(queryMsg)
  );

  return parsedResponse;
}

export async function getMinimumBet(contract: Contract | undefined) {
  if (!contract) {
    return -1;
  }

  const queryMsg = { minimum_bet: {} };
  const parsedResponse = await queryContract(
    contract,
    JSON.stringify(queryMsg)
  );

  return parsedResponse / 10 ** CW_DECIMALS;
}

export async function getHistoryLogs(
  contract: Contract | undefined,
  offset = 0,
  limit = DEFAULT_HISTORY_LOG_LIMIT
) {
  if (!contract) {
    return [];
  }

  const queryMsg = { history_logs: { offset, limit } };
  const parsedResponse = await queryContract(
    contract,
    JSON.stringify(queryMsg)
  );

  return parsedResponse;
}

export async function flip(
  contract: Contract | undefined,
  isHead: boolean,
  wager: number
) {
  if (!contract) {
    return;
  }

  const executeMsg = { flip: { is_head: isHead } };
  const executeResponse = await contract.execute(
    CW_FLIP_COIN_CONTRACT,
    toUtf8Bytes(JSON.stringify(executeMsg)),
    toUtf8Bytes(
      JSON.stringify([
        { amount: String(wager * 10 ** CW_DECIMALS), denom: "usei" },
      ])
    ),
    {
      gasLimit: 1000_000,
      value: String(wager * 10 ** FLIP_EVM_DECIMALS * 10 ** CW_DECIMALS),
    }
  );

  await executeResponse.wait();
}

export async function getEvmAddress(
  contract: Contract | undefined,
  address: string
) {
  if (!contract) {
    return address;
  }

  const evmAddress = await contract.getEvmAddr(address);
  return evmAddress;
}
