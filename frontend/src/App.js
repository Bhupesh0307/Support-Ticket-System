import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

/* ─── Global Styles injected via a style tag ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0d0d0d;
      --surface:    #141414;
      --card:       #1c1c1c;
      --card-alt:   #222222;
      --border:     rgba(255,255,255,0.07);
      --border-hi:  rgba(255,255,255,0.14);
      --gold:       #c9a84c;
      --gold-dim:   #7a5f28;
      --gold-glow:  rgba(201,168,76,0.18);
      --red:        #d94f4f;
      --teal:       #3fb8a0;
      --blue:       #5b8dd9;
      --amber:      #e08c4a;
      --text-primary:   #f0ede6;
      --text-secondary: #8a8578;
      --text-muted:     #4a4744;
      --font-display: 'DM Serif Display', Georgia, serif;
      --font-mono:    'JetBrains Mono', 'Courier New', monospace;
      --font-body:    'Lora', Georgia, serif;
      --radius:       4px;
      --radius-lg:    8px;
    }

    body {
      background: var(--ink);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      70%  { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
      100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .fade-up { animation: fadeUp 0.5s ease both; }
    .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s 0.10s ease both; }
    .fade-up-3 { animation: fadeUp 0.5s 0.15s ease both; }

    /* ── Inputs & selects base reset ── */
    input, textarea, select {
      background: var(--card-alt);
      border: 1px solid var(--border-hi);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 13px;
      border-radius: var(--radius);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      padding: 10px 12px;
      width: 100%;
    }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }
    input:focus, textarea:focus, select:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px var(--gold-glow);
    }
    select option { background: var(--card-alt); }

    /* ── Gold divider ── */
    .gold-rule {
      display: block; height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0.4; margin: 0;
    }

    /* ── Tag badges ── */
    .badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 2px;
    }
    .badge-low      { background: rgba(91,141,217,0.15); color: var(--blue);  border: 1px solid rgba(91,141,217,0.3); }
    .badge-medium   { background: rgba(224,140,74,0.15); color: var(--amber); border: 1px solid rgba(224,140,74,0.3); }
    .badge-high     { background: rgba(217,79,79,0.15);  color: var(--red);   border: 1px solid rgba(217,79,79,0.3); }
    .badge-critical { background: rgba(217,79,79,0.28);  color: #ff7b7b;      border: 1px solid rgba(217,79,79,0.5); animation: pulse-ring 1.8s ease infinite; }

    .badge-billing   { background: rgba(201,168,76,0.12); color: var(--gold);  border: 1px solid rgba(201,168,76,0.25); }
    .badge-technical { background: rgba(63,184,160,0.12); color: var(--teal);  border: 1px solid rgba(63,184,160,0.25); }
    .badge-account   { background: rgba(91,141,217,0.12); color: var(--blue);  border: 1px solid rgba(91,141,217,0.25); }
    .badge-general   { background: rgba(255,255,255,0.06); color: var(--text-secondary); border: 1px solid var(--border-hi); }

    .badge-open        { background: rgba(63,184,160,0.12); color: var(--teal); border:1px solid rgba(63,184,160,0.3); }
    .badge-in_progress { background: rgba(224,140,74,0.12); color: var(--amber); border:1px solid rgba(224,140,74,0.3); }
    .badge-resolved    { background: rgba(91,141,217,0.12); color: var(--blue); border:1px solid rgba(91,141,217,0.3); }
    .badge-closed      { background: rgba(255,255,255,0.05); color: var(--text-muted); border:1px solid var(--border); }

    /* ── Stat cards ── */
    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px 22px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
    }
    .stat-card::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--gold-glow) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .stat-card:hover { border-color: var(--gold-dim); transform: translateY(-2px); }
    .stat-card:hover::before { opacity: 1; }
    .stat-card-value {
      font-family: var(--font-mono);
      font-size: 36px; font-weight: 700;
      color: var(--gold); line-height: 1;
    }
    .stat-card-label {
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--text-secondary);
      margin-top: 6px;
    }

    /* ── Primary button ── */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-mono);
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      padding: 12px 28px;
      border: 1px solid var(--gold);
      border-radius: var(--radius);
      background: linear-gradient(135deg, var(--gold-dim) 0%, #8c6d2e 100%);
      color: #f5e6c0;
      cursor: pointer;
      transition: all 0.2s;
      position: relative; overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.2s;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
    .btn-primary:hover::after { opacity: 1; }
    .btn-primary:active { transform: translateY(0); }

    /* ── Section card ── */
    .section-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .section-header {
      padding: 20px 24px 16px;
      display: flex; align-items: center; gap: 12px;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: 22px;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .section-eyebrow {
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--gold);
    }

    /* ── Spinner ── */
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid var(--border-hi);
      border-top-color: var(--gold);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── Table ── */
    .ticket-table { width: 100%; border-collapse: collapse; }
    .ticket-table th {
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--text-secondary);
      padding: 10px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .ticket-row {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
    }
    .ticket-row:last-child { border-bottom: none; }
    .ticket-row:hover { background: rgba(201,168,76,0.04); }
    .ticket-row td { padding: 12px 16px; vertical-align: middle; }
    .ticket-title { font-weight: 600; color: var(--text-primary); font-size: 14px; }
    .ticket-desc { color: var(--text-secondary); font-size: 13px; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .status-select {
      background: transparent;
      border: 1px solid var(--border-hi);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 4px 8px;
      border-radius: var(--radius);
      cursor: pointer;
      width: auto;
    }
    .status-select:focus { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-glow); }

    /* ── Filter pills ── */
    .filter-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 14px 24px; background: var(--surface); border-bottom: 1px solid var(--border); }
    .filter-label { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
    .filter-select {
      background: var(--card); border: 1px solid var(--border-hi);
      color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;
      border-radius: var(--radius); padding: 6px 10px; cursor: pointer; width: auto;
      transition: border-color 0.15s;
    }
    .filter-select:focus { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-glow); }
    .filter-search {
      flex: 1; min-width: 200px;
      background: var(--card); border: 1px solid var(--border-hi);
      color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;
      border-radius: var(--radius); padding: 6px 10px;
    }
    .filter-search:focus { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-glow); }

    /* ── Form grid ── */
    .form-grid { padding: 20px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group-full { grid-column: 1 / -1; }
    .form-label { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 6px; }
    .form-error { color: var(--red); font-family: var(--font-mono); font-size: 12px; margin-top: 4px; }

    /* ── Classifying strip ── */
    .classifying-strip {
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-mono); font-size: 11px; color: var(--gold);
      margin-top: 6px;
      background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.2);
      border-radius: var(--radius); padding: 6px 10px;
    }

    /* ── Breakdown list ── */
    .breakdown-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .breakdown-item { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; }
    .breakdown-bar-track { flex: 1; height: 3px; background: var(--border-hi); border-radius: 2px; }
    .breakdown-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--gold-dim), var(--gold)); transition: width 0.6s ease; }
    .breakdown-key { color: var(--text-secondary); width: 72px; text-transform: capitalize; }
    .breakdown-val { color: var(--gold); font-weight: 700; min-width: 24px; text-align: right; }

    /* ── Empty state ── */
    .empty-state { padding: 48px; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 13px; }
    .empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.4; }

    /* ── Header corner accent ── */
    .corner-accent {
      width: 6px; height: 6px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold);
      position: absolute; top: 12px; left: 12px;
    }
    .corner-accent-br {
      width: 6px; height: 6px; border-bottom: 2px solid var(--gold-dim); border-right: 2px solid var(--gold-dim);
      position: absolute; bottom: 12px; right: 12px;
    }
  `}</style>
);

/* ─── Utility ─── */
const priorityClass = (p) => `badge badge-${p || "low"}`;
const categoryClass = (c) => `badge badge-${c || "general"}`;
const statusClass   = (s) => `badge badge-${s || "open"}`;

function BreakdownBar({ data, total }) {
  return (
    <ul className="breakdown-list">
      {Object.entries(data || {}).map(([key, val]) => (
        <li key={key} className="breakdown-item">
          <span className="breakdown-key">{key}</span>
          <div className="breakdown-bar-track">
            <div className="breakdown-bar-fill" style={{ width: total ? `${(val / total) * 100}%` : "0%" }} />
          </div>
          <span className="breakdown-val">{val}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Stats Dashboard ─── */
function StatsDashboard({ reloadFlag }) {
  const [stats, setStats] = useState({
    total_tickets: 0, open_tickets: 0, avg_tickets_per_day: 0,
    priority_breakdown: {}, category_breakdown: {},
  });

  useEffect(() => {
    axios.get(`${API_BASE}/api/tickets/stats/`)
      .then(r => setStats(r.data))
      .catch(() => {});
  }, [reloadFlag]);

  return (
    <div className="section-card fade-up" style={{ marginBottom: 20 }}>
      <div className="section-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        <div>
          <div className="section-eyebrow">Operations Center</div>
          <div className="section-title">Live Dashboard</div>
        </div>
        <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", boxShadow: "0 0 8px var(--teal)" }} />
      </div>

      {/* Stat cards */}
      <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Total Tickets",      value: stats.total_tickets },
          { label: "Open Tickets",       value: stats.open_tickets },
          { label: "Avg / Day",          value: stats.avg_tickets_per_day },
        ].map(({ label, value }, i) => (
          <div key={label} className={`stat-card fade-up-${i + 1}`} style={{ position: "relative" }}>
            <div className="corner-accent" />
            <div className="corner-accent-br" />
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Breakdowns */}
      <div style={{ padding: "0 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div className="form-label" style={{ marginBottom: 10 }}>Priority Breakdown</div>
          <BreakdownBar data={stats.priority_breakdown} total={stats.total_tickets} />
        </div>
        <div>
          <div className="form-label" style={{ marginBottom: 10 }}>Category Breakdown</div>
          <BreakdownBar data={stats.category_breakdown} total={stats.total_tickets} />
        </div>
      </div>
    </div>
  );
}

/* ─── Ticket Form ─── */
function TicketForm({ onTicketCreated }) {
  const [title, setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [classifying, setClassifying] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    if (!description.trim()) { setCategory(""); setPriority(""); return; }
    setClassifying(true);
    axios.post(`${API_BASE}/api/tickets/classify/`, { description })
      .then(r => { setCategory(r.data.suggested_category || ""); setPriority(r.data.suggested_priority || ""); })
      .catch(() => {})
      .finally(() => setClassifying(false));
  }, [description]);

  const handleSubmit = (e) => {
    e.preventDefault(); setError("");
    axios.post(`${API_BASE}/api/tickets/`, { title, description, category, priority })
      .then(() => {
        setTitle(""); setDescription(""); setCategory(""); setPriority("");
        setSuccess(true); setTimeout(() => setSuccess(false), 2500);
        if (onTicketCreated) onTicketCreated();
      })
      .catch(() => setError("Failed to submit ticket. Please try again."));
  };

  return (
    <div className="section-card fade-up-1" style={{ marginBottom: 20 }}>
      <div className="section-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        <div>
          <div className="section-eyebrow">New Submission</div>
          <div className="section-title">Open a Ticket</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Title - full width */}
          <div className="form-group-full">
            <label className="form-label">Title</label>
            <input type="text" required placeholder="Brief summary of the issue" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* Description - full width */}
          <div className="form-group-full">
            <label className="form-label">Description</label>
            <textarea required placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} style={{ height: 88, resize: "vertical" }} />
            {classifying && (
              <div className="classifying-strip">
                <div className="spinner" />
                AI classification in progress…
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select value={category} required onChange={e => setCategory(e.target.value)}>
              <option value="" disabled>Select category</option>
              {["billing","technical","account","general"].map(v => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="form-label">Priority</label>
            <select value={priority} required onChange={e => setPriority(e.target.value)}>
              <option value="" disabled>Select priority</option>
              {["low","medium","high","critical"].map(v => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Actions row */}
          <div className="form-group-full" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button type="submit" className="btn-primary">
              <span>⊕</span> Submit Ticket
            </button>
            {success && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)" }}>
                ✓ Ticket submitted successfully
              </span>
            )}
            {error && <span className="form-error">{error}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}

/* ─── Ticket List ─── */
function TicketList({ reloadFlag, onTicketUpdated }) {
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [search, setSearch]     = useState("");

  const handleStatusChange = (id, status) => {
    axios.patch(`${API_BASE}/api/tickets/${id}/`, { status })
      .then(() => { if (onTicketUpdated) onTicketUpdated(); })
      .catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (statusFilter)   params.status   = statusFilter;
    if (search.trim())  params.search   = search.trim();
    axios.get(`${API_BASE}/api/tickets/`, { params })
      .then(r => setTickets(r.data))
      .finally(() => setLoading(false));
  }, [reloadFlag, categoryFilter, priorityFilter, statusFilter, search]);

  return (
    <div className="section-card fade-up-2">
      {/* Header */}
      <div className="section-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        <div>
          <div className="section-eyebrow">Support Queue</div>
          <div className="section-title">All Tickets</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
          {!loading && <span>{tickets.length} result{tickets.length !== 1 ? "s" : ""}</span>}
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>

        {[
          { label: "Category", value: categoryFilter, set: setCategoryFilter, opts: ["billing","technical","account","general"] },
          { label: "Priority", value: priorityFilter, set: setPriorityFilter, opts: ["low","medium","high","critical"] },
          { label: "Status",   value: statusFilter,   set: setStatusFilter,   opts: ["open","in_progress","resolved","closed"] },
        ].map(({ label, value, set, opts }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="filter-label">{label}</span>
            <select className="filter-select" value={value} onChange={e => set(e.target.value)}>
              <option value="">All</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <input
          className="filter-search"
          type="text"
          placeholder="Search tickets…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          <div className="spinner" /> Loading tickets…
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          No tickets match the current filters.
        </div>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              {["Title", "Description", "Category", "Priority", "Status"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="ticket-row">
                <td className="ticket-title">{t.title}</td>
                <td><span className="ticket-desc">{t.description}</span></td>
                <td><span className={categoryClass(t.category)}>{t.category}</span></td>
                <td><span className={priorityClass(t.priority)}>{t.priority}</span></td>
                <td>
                  <select
                    className="status-select"
                    value={t.status}
                    onChange={e => handleStatusChange(t.id, e.target.value)}
                  >
                    {["open","in_progress","resolved","closed"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ─── App Shell ─── */
export default function App() {
  const [reloadFlag, setReloadFlag] = useState(0);
  const bump = useCallback(() => setReloadFlag(f => f + 1), []);

  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: "100vh",
        padding: "0 0 60px",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 70%), var(--ink)",
      }}>
        {/* ── Top bar ── */}
        <header style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 40px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(20,20,20,0.9)",
          backdropFilter: "blur(10px)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo mark */}
            <div style={{
              width: 28, height: 28, border: "1.5px solid var(--gold)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--gold)",
            }}>
              T
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
              TicketDesk
            </span>
            <span style={{ height: 16, width: 1, background: "var(--border-hi)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Support Portal
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", boxShadow: "0 0 6px var(--teal)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>SYSTEM OPERATIONAL</span>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 0" }}>
          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>
              / DASHBOARD
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Support Operations
            </h1>
            <span className="gold-rule" style={{ marginTop: 14, display: "block" }} />
          </div>

          <StatsDashboard reloadFlag={reloadFlag} />
          <TicketForm onTicketCreated={bump} />
          <TicketList reloadFlag={reloadFlag} onTicketUpdated={bump} />
        </main>
      </div>
    </>
  );
}