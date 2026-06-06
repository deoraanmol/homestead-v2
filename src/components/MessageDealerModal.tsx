"use client";

import { FormEvent, useState } from "react";
import { MessageSquare, X } from "lucide-react";

type Props = {
  recipientName: string;
  onClose: () => void;
};

export function MessageDealerModal({ recipientName, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Message {recipientName}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Messaging is a placeholder in this phase — no messages are sent.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
            Your message has been queued (demo). {recipientName} would respond shortly in a
            production build.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <textarea
              required
              className="input-field min-h-[120px] resize-y bg-white"
              placeholder="Hi, I'm interested in learning more about your listings…"
            />
            <button type="submit" className="btn-primary w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
