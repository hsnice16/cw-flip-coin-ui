import {
  CW_DECIMALS,
  CW_FLIP_COIN_CONTRACT,
  EVM_DECIMALS,
  WASM_PRECOMPILE_ABI,
  WASM_PRECOMPILE_ADDRESS,
} from "@/constant/value";

import {
  Contract,
  ContractRunner,
  InterfaceAbi,
  toUtf8Bytes,
  toUtf8String,
} from "ethers";

/**
 * The ABI for the Wasm precompile contract, used to create an Ethers contract.
 * @category Cosmos Interoperability
 */
export const ETHERS_WASM_PRECOMPILE_ABI = WASM_PRECOMPILE_ABI as InterfaceAbi;

export function getWasmPrecompileEthersV6Contract(runner: ContractRunner) {
  return new Contract(
    WASM_PRECOMPILE_ADDRESS,
    ETHERS_WASM_PRECOMPILE_ABI,
    runner
  );
}

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

export async function getHistoryLogs(contract: Contract | undefined) {
  if (!contract) {
    return [];
  }

  const queryMsg = { history_logs: {} };
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
    { gasLimit: 1000_000, value: String(wager * 10 ** EVM_DECIMALS) }
  );

  await executeResponse.wait();
  console.log("executeResponse", executeResponse);
}
