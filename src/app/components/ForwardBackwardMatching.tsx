import React from "react";
import { AlertCircle } from "lucide-react";

export function ForwardBackwardMatching() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg text-gray-600 mb-2">前后向匹配</h3>
          <p className="text-sm text-gray-400">该模块正在开发中...</p>
        </div>
      </div>
    </div>
  );
}