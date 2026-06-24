"use client";
import { useState } from "react";

export default function ContactForm({ lang }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(
          lang === "id"
            ? "✅ Pesan Anda berhasil dikirim ke Admin M-YES!"
            : "✅ Your message has been sent to M-YES Admin!",
        );
        e.target.reset(); // Kosongkan form setelah sukses
      } else {
        alert(
          lang === "id"
            ? "❌ Gagal mengirim pesan. Silakan coba lagi."
            : "❌ Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      alert("Error system.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{lang === "id" ? "Nama" : "Name"}</label>
        <input
          type="text"
          name="name"
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            marginBottom: "1rem",
          }}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            marginBottom: "1rem",
          }}
        />
      </div>
      <div className="form-group">
        <label>{lang === "id" ? "Pesan" : "Message"}</label>
        <textarea
          name="message"
          rows={4}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "14px",
          background: isSubmitting ? "#475569" : "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting
          ? lang === "id"
            ? "Mengirim..."
            : "Sending..."
          : lang === "id"
            ? "Kirim Pesan"
            : "Send Message"}
      </button>
    </form>
  );
}
