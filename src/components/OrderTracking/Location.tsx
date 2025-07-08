"use client";

import React, { useState } from "react";

export default function DeliveryChecker() {
  const [address, setAddress] = useState("");

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Check Delivery Distance</h1>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
