import React from "react";
import FigmaDashboard from "../imports/定稿版-1/定稿版";

export default function Dashboard() {
  return (
    <div className="w-full h-full overflow-auto bg-[#e7f3ff]">
      <div className="relative w-[1920px] h-[1080px] mx-auto">
        <FigmaDashboard />
      </div>
    </div>
  );
}