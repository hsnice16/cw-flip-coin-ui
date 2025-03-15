import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ToastState = {
  _id: number;
  msg: string;
  type: "info" | "warning" | "error" | "";
};

export type ToastsContextType = {
  toasts: ToastState[];
  setToast: (toast: Omit<ToastState, "_id">) => void;
  setToasts: Dispatch<SetStateAction<ToastState[]>>;
};

const ToastsContext = createContext<ToastsContextType>({
  toasts: [],
  setToast: () => {},
  setToasts: () => {},
});

export default function ToastsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const setToast = (toast: Omit<ToastState, "_id">) => {
    setToasts((prev) => [...prev, { ...toast, _id: prev.length + 1 }]);
  };

  const value = {
    toasts,
    setToast,
    setToasts,
  };

  return (
    <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
  );
}

export function useToasts() {
  return useContext(ToastsContext);
}
