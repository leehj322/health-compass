"use client";

import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

export function defaultToast(title: string, description?: string) {
  toast(
    <div>
      <h5 className="flex items-center gap-2 font-semibold">{title}</h5>
      {description && <p className="text-gray-700">{description}</p>}
    </div>,
  );
}

export function ErrorToast(title: string, description?: string) {
  toast(
    <div>
      <h5 className="flex items-center gap-2 font-semibold text-red-500">
        <CircleAlert size={16} />
        {title}
      </h5>
      {description && <p className="text-gray-700">{description}</p>}
    </div>,
  );
}
