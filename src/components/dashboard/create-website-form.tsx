"use client";

import { useState } from "react";

export function CreateWebsiteForm() {
  const [name, setName] = useState("");

  const [domain, setDomain] =
    useState("");

  async function handleCreateWebsite() {
    await fetch("/api/websites", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        domain,
      }),
    });

    window.location.reload();
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Create Website
      </h2>

      <input
        className="w-full rounded-md border p-2"
        placeholder="Website Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="w-full rounded-md border p-2"
        placeholder="example.com"
        value={domain}
        onChange={(e) =>
          setDomain(e.target.value)
        }
      />

      <button
        onClick={handleCreateWebsite}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Create
      </button>
    </div>
  );
}