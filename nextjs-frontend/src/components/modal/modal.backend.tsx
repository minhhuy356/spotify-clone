// components/BackendErrorModal.tsx
"use client";

import { backendUrl } from "@/api/url";
import { useEffect, useState } from "react";

const ModalBackendError = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const checkBackend = async () => {
      try {
        const res = await fetch(`${backendUrl}api/v1/health`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Backend error");
      } catch (error) {
        setShow(true);
      }
    };

    checkBackend();
    return () => controller.abort();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black-05 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">
          Không thể kết nối tới server
        </h2>
        <p className="text-gray-600">
          Vui lòng kiểm tra lại backend hoặc thử tải lại trang.
        </p>
      </div>
    </div>
  );
};

export default ModalBackendError;
