import { useState } from "react";

const Donate = () => {
  const [form, setForm] = useState({ phone: "", amount: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/mpesa/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "danger", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to right, #22FFCC, #E1EECC)" }}>
      <div className="card shadow p-4 bg-white" style={{ width: "22rem", borderRadius: "10px" }}>
        <h2 className="text-center mb-3">Donate via M-Pesa</h2>

        {message && <p className={`text-${message.type} text-center`}>{message.text}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="07XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Amount (KES)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donate;
