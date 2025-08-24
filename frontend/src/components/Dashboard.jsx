import React from "react";
import RegisterFace from "./RegisterFace";
import RecognizeFace from "./RecognizeFace";

export default function Dashboard({ tab }) {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">SecureCampus 2.0</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {(tab === "register" || !tab) && <RegisterFace />}
        {(tab === "recognize" || !tab) && <RecognizeFace />}
      </div>
    </div>
  );
}
