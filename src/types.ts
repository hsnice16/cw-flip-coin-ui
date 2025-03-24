export interface HistoryLog {
  did_win: boolean;
  wager: number;
  user_address: string;
  timestamp_seconds: number;
  flip_id: string;
  bet_is_head: boolean;
}

export type LastBet = {
  wager: number;
  did_win: boolean;
  player: string;
  flip_id: string;
};
