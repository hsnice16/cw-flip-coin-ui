import { ToastState, useToasts } from "@/context/ToastsContext";
import { useEffect, useState } from "react";

type ToastProps = {
  _id: ToastState["_id"];
  msg: ToastState["msg"];
  type: ToastState["type"];
};

export default function Toast({ msg, type, _id }: ToastProps) {
  const [show, setShow] = useState(true);
  const { setToasts } = useToasts();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((_toast) => _toast._id !== _id));
      setShow(false);
    }, 3800);

    return () => clearTimeout(timeoutId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  if (show === false) {
    return null;
  }

  return (
    <div className="bg-secondary-bg rounded-sm p-1 max-w-[240px]">
      <p className="py-2 px-3 text-[14px]">{msg}</p>
      <div
        className={`${
          type === "info"
            ? "bg-lb-gray"
            : type === "warning"
            ? "bg-warning"
            : "bg-error"
        } h-0.5 transition-all animate-toast-status`}
      ></div>
    </div>
  );
}
