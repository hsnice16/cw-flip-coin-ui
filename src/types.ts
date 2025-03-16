export interface HistoryLog {
  did_win: boolean;
  wager: number;
  user_address: string;
  timestamp_seconds: number;
  flip_id: string;
  bet_is_head: boolean;
}
