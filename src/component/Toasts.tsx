import { useToasts } from "@/context/ToastsContext";
import Toast from "./Toast";

export default function Toasts() {
  const { toasts } = useToasts();

  return (
    <div className="absolute right-4 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast._id}
          _id={toast._id}
          msg={toast.msg}
          type={toast.type}
        />
      ))}
    </div>
  );
}
