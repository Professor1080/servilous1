 "use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Bell, BriefcaseBusiness,
  Building2, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleDollarSign, ClipboardCheck, Clock3, Download, FileCheck2, Filter, HardHat, LayoutDashboard,
  LifeBuoy, LogOut, Menu, MoreHorizontal, Search, Settings, ShieldCheck, Star, Users, UserRound,
  Wallet, X, Zap, MapPin, TrendingUp, UserCheck, CircleHelp, Eye, Plus
} from "lucide-react";

type Role = "Owner" | "Worker" | "Customer" | "Corporate";
type WorkerStatus = "Working" | "Available" | "Verification pending" | "On leave";
type Worker = {
  id: string; name: string; initials: string; role: string; location: string;
  status: WorkerStatus; verification: "Verified" | "Pending" | "Rejected";
  salary: number; expected: number; minimum: number; rating: number; manager: string;
};

const initialWorkers: Worker[] = [
  { id: "SV-1001", name: "Aarav Kumar", initials: "AK", role: "Warehouse Associate", location: "Patna, Bihar", status: "Working", verification: "Verified", salary: 18000, expected: 20000, minimum: 16000, rating: 4.8, manager: "Priya Sharma" },
  { id: "SV-1002", name: "Priya Kumari", initials: "PK", role: "Housekeeping", location: "Bihta, Bihar", status: "Available", verification: "Verified", salary: 14000, expected: 16000, minimum: 13000, rating: 4.9, manager: "Rohit Singh" },
  { id: "SV-1003", name: "Mohammed Sameer", initials: "MS", role: "Electrician", location: "Patna, Bihar", status: "Verification pending", verification: "Pending", salary: 22000, expected: 24000, minimum: 20000, rating: 4.6, manager: "Priya Sharma" },
  { id: "SV-1004", name: "Anjali Das", initials: "AD", role: "Office Assistant", location: "Danapur, Bihar", status: "On leave", verification: "Verified", salary: 16000, expected: 17000, minimum: 15000, rating: 4.7, manager: "Rohit Singh" },
  { id: "SV-1005", name: "Ravi Paswan", initials: "RP", role: "Security Guard", location: "Patna, Bihar", status: "Available", verification: "Pending", salary: 17000, expected: 18000, minimum: 15000, rating: 4.2, manager: "Priya Sharma" },
  { id: "SV-1006", name: "Neha Kumari", initials: "NK", role: "Kitchen Assistant", location: "Bihta, Bihar", status: "Working", verification: "Verified", salary: 15000, expected: 16000, minimum: 14000, rating: 4.5, manager: "Rohit Singh" },
  { id: "SV-1007", name: "Imran Ali", initials: "IA", role: "Delivery Associate", location: "Patna, Bihar", status: "Available", verification: "Rejected", salary: 15500, expected: 17000, minimum: 14000, rating: 4.1, manager: "Priya Sharma" },
];

const navByRole: Record<Role, string[]> = {
  Owner: ["Overview", "Workers", "Verification", "Assignments", "Payroll", "Companies", "Hierarchy", "Ratings & feedback", "Reports", "Settings"],
  Worker: ["My dashboard", "Find work", "My assignments", "Attendance", "Earnings & salary", "My ratings", "Support"],
  Customer: ["Dashboard", "Find workers", "My bookings", "Payments", "Reviews", "Support"],
  Corporate: ["Dashboard", "Bulk staffing", "Workforce roster", "Attendance", "Invoices & payments", "Feedback", "Reports"],
};

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const statusClass = (s: string) => s.toLowerCase().replaceAll(" ", "-");

export default function Home() {
  const [role, setRole] = useState<Role>("Owner");
  const [active, setActive] = useState("Overview");
  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const nav = navByRole[role];
  const filteredWorkers = useMemo(() => workers.filter(w => {
    const q = search.toLowerCase();
    const matchesSearch = [w.name, w.id, w.role, w.location].some(v => v.toLowerCase().includes(q));
    const matchesFilter = filter === "All statuses" || w.status === filter || w.verification === filter;
    return matchesSearch && matchesFilter;
  }), [workers, search, filter]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const switchRole = (next: Role) => {
    setRole(next);
    setActive(navByRole[next][0]);
    setSearch("");
    setFilter("All statuses");
  };

  const verifyWorker = (id: string) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, verification: "Verified" as const, status: w.status === "Verification pending" ? "Available" as const : w.status } : w));
    notify("Worker verified in this demo.");
  };

  const exportCsv = () => {
    const rows = [["ID", "Name", "Role", "Location", "Status", "Verification", "Salary", "Expected salary", "Minimum acceptable", "Rating", "Manager"],
      ...filteredWorkers.map(w => [w.id, w.name, w.role, w.location, w.status, w.verification, w.salary, w.expected, w.minimum, w.rating, w.manager])];
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "servilus-workers-demo.csv"; a.click(); URL.revokeObjectURL(url);
    notify("CSV export downloaded.");
  };

  const totalPayroll = workers.filter(w => w.status === "Working").reduce((sum, w) => sum + w.salary, 0);
  const pending = workers.filter(w => w.verification === "Pending").length;
  const working = workers.filter(w => w.status === "Working").length;
  const available = workers.filter(w => w.status === "Available").length;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>S</span><i /></div>
          <div><div className="brand-name">servilus<span>.</span></div><div className="brand-sub">WORKFORCE OS</div></div>
          <button className="icon-btn sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch" onClick={() => setShowProfile(!showProfile)}>
          <div className="workspace-avatar">S</div><div className="workspace-copy"><strong>Servilus HQ</strong><small>India · Main workspace</small></div><ChevronDown size={15}/>
        </button>
        <div className="nav-label">MENU</div>
        <nav className="nav-list">
          {nav.map((item, index) => {
            const Icon = item.includes("Overview") || item.includes("dashboard") || item === "Dashboard" ? LayoutDashboard :
              item.includes("Worker") || item === "Workers" ? Users :
              item.includes("Verification") ? ShieldCheck :
              item.includes("Assignment") || item.includes("work") || item.includes("booking") ? BriefcaseBusiness :
              item.includes("Payroll") || item.includes("salary") || item.includes("Earnings") || item.includes("Payments") || item.includes("Invoices") ? Wallet :
              item.includes("Companies") || item.includes("staffing") ? Building2 :
              item.includes("Hierarchy") ? UserCheck :
              item.includes("Rating") || item.includes("feedback") || item.includes("Reviews") ? Star :
              item.includes("Attendance") || item.includes("roster") ? CalendarDays :
              item.includes("Reports") ? TrendingUp :
              item.includes("Support") ? LifeBuoy : item.includes("Settings") ? Settings : HardHat;
            return <button key={item} className={`nav-item ${active === item ? "active" : ""}`} onClick={() => { setActive(item); setMobileNav(false); }}>
              <Icon size={17} strokeWidth={1.8}/><span>{item}</span>{item === "Verification" && pending > 0 && role === "Owner" && <em>{pending}</em>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Our team is here to help you get the most out of Servilus.</p><button onClick={() => notify("Help centre is a demo placeholder.")}>Visit help centre <ArrowRight size={13}/></button></div>
          <button className="nav-item" onClick={() => notify("This is a demo. No account is signed in.")}><LogOut size={17}/><span>Sign out</span></button>
          <div className="profile-mini"><div className="avatar avatar-purple">YI</div><div className="profile-text"><strong>Yusuf Imtiyaz</strong><small>{role} account · Demo</small></div><MoreHorizontal size={19}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="top-left"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{active}</strong></div></div>
          <div className="top-actions">
            <div className="role-switcher"><span>Preview as</span><select value={role} onChange={e => switchRole(e.target.value as Role)} aria-label="Preview portal">{(["Owner", "Worker", "Customer", "Corporate"] as Role[]).map(r => <option key={r}>{r}</option>)}</select></div>
            <button className="icon-btn notification-btn" onClick={() => notify("You're all caught up.")} aria-label="Notifications"><Bell size={18}/><i/></button>
            <button className="avatar avatar-purple top-avatar" onClick={() => setShowProfile(!showProfile)} aria-label="Open profile">YI</button>
          </div>
        </header>

        {showProfile && <div className="profile-popover"><strong>Yusuf Imtiyaz</strong><span>{role} demo account</span><button onClick={() => { setShowProfile(false); notify("Account settings are a demo placeholder."); }}>Account settings <ArrowRight size={14}/></button></div>}

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot"/> THURSDAY, OCTOBER 22, 2026</div><h1>{active === "Overview" || active === "My dashboard" || active === "Dashboard" ? `Good afternoon, Yusuf` : active}</h1><p>{active === "Overview" ? "Here’s what’s happening across your workforce today." : `Manage ${active.toLowerCase()} across your Servilus workspace.`}</p></div>
            <div className="heading-actions"><button className="btn btn-secondary" onClick={exportCsv}><Download size={15}/> Export</button><button className="btn btn-primary" onClick={() => notify(role === "Owner" ? "New worker form is ready to connect to the backend." : role === "Corporate" ? "New staffing request form is ready to connect to the backend." : "New request form is ready to connect to the backend.")}><Plus size={16}/> {role === "Owner" ? "Add worker" : role === "Corporate" ? "New request" : role === "Customer" ? "Book a worker" : "Find work"}</button></div>
          </div>

          {role === "Owner" && (active === "Overview" || active === "Workers" || active === "Verification") ? <>
            <div className="stats-grid">
              <StatCard label="Total workforce" value={String(workers.length).padStart(2, "0")} change="+12.8%" note="vs last month" icon={<Users size={18}/>} tone="blue" trend="up"/>
              <StatCard label="Currently working" value={String(working).padStart(2, "0")} change="+4.2%" note="vs last week" icon={<BriefcaseBusiness size={18}/>} tone="green" trend="up"/>
              <StatCard label="Available workers" value={String(available).padStart(2, "0")} change="Ready to assign" note="across all locations" icon={<UserCheck size={18}/>} tone="purple"/>
              <StatCard label="Pending verification" value={String(pending).padStart(2, "0")} change="Needs attention" note="review documents" icon={<ShieldCheck size={18}/>} tone="orange" alert/>
            </div>
            <div className="content-grid">
              <section className="panel workforce-panel">
                <div className="panel-heading"><div><h2>{active === "Verification" ? "Verification queue" : "Workforce overview"}</h2><p>Monitor worker status and verification at a glance.</p></div><button className="text-link" onClick={() => setActive("Workers")}>View all workers <ArrowRight size={14}/></button></div>
                <div className="chart-wrap">
                  <div className="chart-summary"><strong>Workforce status</strong><span>Current snapshot</span></div>
                  <div className="donut-row"><div className="donut"><div className="donut-inner"><strong>{workers.length}</strong><span>workers</span></div></div><div className="legend">
                    <Legend color="var(--blue)" label="Working" value={working}/>
                    <Legend color="var(--green)" label="Available" value={available}/>
                    <Legend color="var(--orange)" label="Verification pending" value={pending}/>
                    <Legend color="#b6bfd0" label="Other status" value={workers.length-working-available-pending}/>
                  </div></div>
                </div>
                <div className="mini-metrics"><div><span>Est. monthly salary · working</span><strong>{money(totalPayroll)}</strong></div><div><span>Average worker rating</span><strong>4.54 <Star size={14} fill="currentColor"/></strong></div><div><span>Verification completion</span><strong>{Math.round((workers.filter(w => w.verification === "Verified").length / workers.length) * 100)}%</strong></div></div>
              </section>
              <section className="panel activity-panel">
                <div className="panel-heading"><div><h2>Operations snapshot</h2><p>Key items to keep things moving.</p></div><button className="icon-btn" onClick={() => notify("Snapshot refreshed for demo data.")}><Activity size={17}/></button></div>
                <div className="operation-list">
                  <Operation icon={<FileCheck2 size={17}/>} tone="orange" title="Worker verifications" description={`${pending} profiles need document review`} value={String(pending).padStart(2, "0")} onClick={() => setActive("Verification")}/>
                  <Operation icon={<Clock3 size={17}/>} tone="blue" title="Attendance review" description="2 records awaiting approval" value="02" onClick={() => setActive("Assignments")}/>
                  <Operation icon={<CircleDollarSign size={17}/>} tone="green" title="Payroll overview" description="Review monthly salary records" value={money(totalPayroll)} onClick={() => setActive("Payroll")}/>
                  <Operation icon={<Building2 size={17}/>} tone="purple" title="Corporate clients" description="Manage business accounts" value="08" onClick={() => setActive("Companies")}/>
                </div>
                <button className="panel-footer-link" onClick={() => setActive("Reports")}>Open operations report <ArrowRight size={14}/></button>
              </section>
            </div>
            <section className="panel workers-panel">
              <div className="panel-heading workers-heading"><div><h2>{active === "Verification" ? "Pending verification" : "Workforce directory"}</h2><p>Worker records, assignment status, and salary overview.</p></div><div className="table-actions"><div className="search-box"><Search size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workers..." aria-label="Search workers"/></div><div className="filter-box"><Filter size={14}/><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter workers"><option>All statuses</option><option>Working</option><option>Available</option><option>On leave</option><option>Pending</option><option>Verified</option><option>Rejected</option></select></div></div></div>
              <div className="table-scroll"><table><thead><tr><th>WORKER</th><th>WORK STATUS</th><th>VERIFICATION</th><th>MONTHLY SALARY</th><th>RATING</th><th>MANAGER</th><th/></tr></thead><tbody>
                {(active === "Verification" ? filteredWorkers.filter(w => w.verification === "Pending") : filteredWorkers).map(w => <tr key={w.id}><td><div className="worker-cell"><div className={`avatar worker-avatar ${w.initials.charCodeAt(0)%2 ? "avatar-blue" : "avatar-peach"}`}>{w.initials}</div><div><strong>{w.name}</strong><small>{w.id} · {w.role}</small></div></div></td><td><span className={`status-pill ${statusClass(w.status)}`}><i/>{w.status}</span></td><td><span className={`verify-pill ${statusClass(w.verification)}`}>{w.verification === "Verified" ? <BadgeCheck size={13}/> : w.verification === "Pending" ? <Clock3 size={13}/> : <X size={13}/>} {w.verification}</span></td><td><strong className="salary-cell">{money(w.salary)}</strong><small className="sub-cell">Expected {money(w.expected)}</small></td><td><span className="rating"><Star size={13} fill="currentColor"/>{w.rating.toFixed(1)}</span></td><td className="manager-cell">{w.manager}</td><td><div className="row-actions">{w.verification === "Pending" && <button className="approve-btn" onClick={() => verifyWorker(w.id)} title="Verify worker"><Check size={14}/> Verify</button>}<button className="icon-btn small" onClick={() => notify(`${w.name}: minimum acceptable ${money(w.minimum)} / month. Demo record only.`)} aria-label={`View ${w.name}`}><Eye size={15}/></button></div></td></tr>)}
              </tbody></table>{filteredWorkers.length === 0 && <div className="empty-state">No workers match your search.</div>}</div>
              <div className="table-bottom"><span>Showing <strong>{filteredWorkers.length}</strong> of <strong>{workers.length}</strong> workers · Demo data</span><div className="pagination"><button className="icon-btn small" disabled><ChevronLeft size={15}/></button><button className="page-number">1</button><button className="icon-btn small" disabled><ChevronRight size={15}/></button></div></div>
            </section>
          </> : <PortalContent role={role} active={active} notify={notify} setActive={setActive} workers={workers}/>}

          <footer className="footer"><span>© 2026 Servilus Technologies. All rights reserved.</span><span><i/> All systems operational <span className="footer-sep">·</span> Demo environment</span></footer>
        </div>
      </section>
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={14}/></button></div>}
    </main>
  );
}

function StatCard({label, value, change, note, icon, tone, trend, alert}: {label:string; value:string; change:string; note:string; icon:React.ReactNode; tone:string; trend?:"up"; alert?:boolean}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}>{icon}</div></div><div className="stat-value">{value}</div><div className={`stat-foot ${alert ? "alert-text" : ""}`}>{trend && <ArrowUpRight size={14}/>}<strong>{change}</strong><span>{note}</span></div></div>;
}
function Legend({color,label,value}:{color:string;label:string;value:number}) { return <div className="legend-item"><i style={{background:color}}/><span>{label}</span><strong>{value}</strong></div>; }
function Operation({icon,tone,title,description,value,onClick}:{icon:React.ReactNode;tone:string;title:string;description:string;value:string;onClick:()=>void}) {
  return <button className="operation-row" onClick={onClick}><div className={`operation-icon ${tone}`}>{icon}</div><div className="operation-copy"><strong>{title}</strong><span>{description}</span></div><div className="operation-value">{value}</div><ChevronRight size={15}/></button>;
}

function PortalContent({role, active, notify, setActive, workers}: {role:Role;active:string;notify:(s:string)=>void;setActive:(s:string)=>void;workers:Worker[]}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [rating, setRating] = useState(5);
  const [reason, setReason] = useState("");
  const list = workers.filter(w => [w.name,w.role,w.location].some(v => v.toLowerCase().includes(query.toLowerCase())));
  const worker = workers.find(w => w.id === selected);
  const isWorker = role === "Worker";
  const isCorporate = role === "Corporate";
  const isCustomer = role === "Customer";

  if ((active.includes("worker") || active === "Find work" || active === "Find workers") && (isCustomer || isWorker)) {
    return <section className="panel directory-panel"><div className="panel-heading"><div><h2>{isWorker ? "Opportunities for you" : "Find your workforce"}</h2><p>{isWorker ? "Browse suitable work opportunities." : "Browse worker profiles for your next booking."}</p></div><div className="search-box"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search skill or location"/></div></div><div className="directory-grid">{list.filter(w => w.verification === "Verified").map(w=><div className="worker-card" key={w.id}><div className="worker-card-top"><div className="avatar avatar-blue">{w.initials}</div><span className="verify-pill verified"><BadgeCheck size={13}/> Verified</span></div><h3>{w.name}</h3><p>{w.role}</p><div className="worker-card-meta"><span><MapPin size={13}/>{w.location}</span><span><Star size={13} fill="currentColor"/>{w.rating.toFixed(1)}</span></div><div className="worker-card-bottom"><div><strong>{money(w.salary)}</strong><small>/ month · demo rate</small></div><button className="btn btn-primary btn-small" onClick={()=>{setSelected(w.id);notify(isWorker ? "Demo opportunity selected." : `Selected ${w.name} for a demo booking.`);}}> {isWorker ? "View job" : "Select worker"} <ArrowRight size={13}/></button></div></div>)}</div></section>;
  }

  if (active.includes("rating") || active.includes("Reviews") || active.includes("Feedback") || active.includes("feedback")) {
    return <section className="panel form-panel"><div className="panel-heading"><div><h2>Trust & feedback</h2><p>Ratings should only be submitted after a completed, verified assignment.</p></div><div className="stat-icon purple"><Star size={18}/></div></div><div className="rating-summary"><div><strong>{isWorker ? "4.8" : isCorporate ? "4.6" : "4.7"}</strong><span><Star size={15} fill="currentColor"/> Average demo rating</span><small>Based on simulated records</small></div><div className="rating-bars">{[["Professionalism",92],["Communication",86],["Reliability",88],["Timeliness",78]].map(([label,n])=><div className="rating-bar" key={label}><span>{label}</span><div><i style={{width:`${n}%`}}/></div><strong>{(Number(n)/20).toFixed(1)}</strong></div>)}</div></div><div className="form-divider"/><h3>Submit demo feedback</h3><label className="field-label">Rating</label><div className="star-picker">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} className={n<=rating?"chosen":""} aria-label={`${n} stars`}><Star size={25} fill={n<=rating?"currentColor":"none"}/></button>)}</div><label className="field-label">Feedback notes</label><textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Share specific, respectful, work-related feedback..." rows={3}/><button className="btn btn-primary" onClick={()=>notify("Demo only: feedback is not saved to a database.")}>Submit demo feedback <ArrowRight size={15}/></button><p className="privacy-note"><ShieldCheck size={14}/> Reviews require a completed assignment and moderation before consequential action.</p></section>;
  }

  if (active.includes("Hierarchy")) {
    return <section className="panel hierarchy-panel"><div className="panel-heading"><div><h2>Organizational hierarchy</h2><p>Illustrative reporting structure for the Servilus operations team.</p></div><button className="btn btn-secondary" onClick={()=>notify("Team creation requires backend permissions.")}><Plus size={15}/> Add team member</button></div><div className="org-tree"><div className="org-node owner-node"><div className="org-avatar">YI</div><div><strong>Yusuf Imtiyaz</strong><span>Owner · Master admin</span></div><span className="org-badge">OWNER</span></div><div className="tree-connector"/><div className="org-branches"><div className="org-branch"><div className="org-node"><div className="org-avatar blue">PS</div><div><strong>Priya Sharma</strong><span>Operations manager</span></div></div><div className="tree-connector"/><div className="org-node worker-node"><div className="org-avatar pale">AK</div><div><strong>Aarav Kumar</strong><span>Warehouse associate</span></div></div><div className="org-node worker-node"><div className="org-avatar pale">MS</div><div><strong>Mohammed Sameer</strong><span>Electrician · Pending verification</span></div></div></div><div className="org-branch"><div className="org-node"><div className="org-avatar green">RS</div><div><strong>Rohit Singh</strong><span>Operations manager</span></div></div><div className="tree-connector"/><div className="org-node worker-node"><div className="org-avatar pale">PK</div><div><strong>Priya Kumari</strong><span>Housekeeping</span></div></div><div className="org-node worker-node"><div className="org-avatar pale">AD</div><div><strong>Anjali Das</strong><span>Office assistant · On leave</span></div></div></div></div></div><p className="privacy-note"><ShieldCheck size={14}/> Demo hierarchy only. Enforce reporting scope and role permissions on the server in production.</p></section>;
  }

  if (active.includes("salary") || active.includes("Earnings") || active === "Payroll" || active.includes("Invoices") || active === "Payments") {
    return <section className="panel"><div className="panel-heading"><div><h2>{isWorker ? "Earnings & salary" : "Payroll & payments"}</h2><p>Illustrative salary records; no real payments are processed.</p></div><div className="stat-icon green"><Wallet size={18}/></div></div><div className="stats-grid inner-stats"><StatCard label="Approved amount" value={money(76000)} change="Demo period" note="illustrative" icon={<CheckCircle2 size={18}/>} tone="green"/><StatCard label="Pending approval" value={money(32000)} change="Review needed" note="demo records" icon={<Clock3 size={18}/>} tone="orange"/><StatCard label="Paid" value={money(124000)} change="Recorded" note="simulated only" icon={<CircleDollarSign size={18}/>} tone="blue"/></div><div className="table-scroll"><table><thead><tr><th>PAY PERIOD</th><th>WORKER / ACCOUNT</th><th>GROSS</th><th>DEDUCTIONS</th><th>NET PAYABLE</th><th>STATUS</th></tr></thead><tbody>{[["Oct 2026","Aarav Kumar",18000,500,17500,"Approved"],["Oct 2026","Priya Kumari",14000,0,14000,"Pending"],["Oct 2026","Neha Kumari",15000,250,14750,"Partially paid"],["Oct 2026","Corporate invoice",76000,0,76000,"Draft"]].map(r=><tr key={String(r[1])}><td>{r[0]}</td><td><strong>{r[1]}</strong></td><td>{money(Number(r[2]))}</td><td>{money(Number(r[3]))}</td><td><strong>{money(Number(r[4]))}</strong></td><td><span className={`status-pill ${statusClass(String(r[5]))}`}><i/>{r[5]}</span></td></tr>)}</tbody></table></div><p className="privacy-note"><ShieldCheck size={14}/> This demo does not calculate statutory minimum wages or process real payments.</p></section>;
  }

  if (active.includes("Hierarchy")) return null;

  const title = active;
  const cards = isCorporate ? [
    ["Workers requested","48","Across active requisitions",<Users size={18}/>],
    ["Workers assigned","39","81% fulfillment",<UserCheck size={18}/>],
    ["Open positions","09","Awaiting allocation",<BriefcaseBusiness size={18}/>],
    ["Staffing cost","₹6.8L","Illustrative monthly total",<Wallet size={18}/>],
  ] : isCustomer ? [
    ["Active bookings","02","Current demo bookings",<CalendarDays size={18}/>],
    ["Completed jobs","12","Historical demo records",<CheckCircle2 size={18}/>],
    ["Saved workers","05","Demo shortlist",<Star size={18}/>],
    ["Pending payments","₹4,500","Simulated amount",<Wallet size={18}/>],
  ] : isWorker ? [
    ["My assignments","02","One upcoming",<BriefcaseBusiness size={18}/>],
    ["Hours this month","128 hrs","Demo attendance",<Clock3 size={18}/>],
    ["Estimated earnings","₹18,000","Illustrative only",<Wallet size={18}/>],
    ["My rating","4.8 / 5","Simulated feedback",<Star size={18}/>],
  ] : [
    ["Active assignments","18","Across current teams",<BriefcaseBusiness size={18}/>],
    ["Attendance review","02","Awaiting manager review",<CalendarDays size={18}/>],
    ["Open requests","06","Demo requests",<ClipboardCheck size={18}/>],
    ["Trust score","4.6 / 5","Simulated rating",<Star size={18}/>],
  ];
  return <><div className="stats-grid">{cards.map(c=><StatCard key={String(c[0])} label={String(c[0])} value={String(c[1])} change={String(c[2])} note="Demo data" icon={c[3]} tone="blue"/>)}</div><div className="content-grid"><section className="panel"><div className="panel-heading"><div><h2>{title} at a glance</h2><p>Example records to demonstrate the interface.</p></div><div className="stat-icon blue"><Activity size={18}/></div></div><div className="feature-list"><div><CheckCircle2/><span><strong>Role-specific workspace</strong><small>Content changes based on the selected portal.</small></span></div><div><ShieldCheck/><span><strong>Verification and trust</strong><small>Verified worker profiles and ratings preview.</small></span></div><div><CalendarDays/><span><strong>Workforce operations</strong><small>Assignments, attendance, and staffing workflows.</small></span></div><div><Wallet/><span><strong>Salary visibility</strong><small>Illustrative wage and payroll records.</small></span></div></div></section><section className="panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Explore common tasks.</p></div></div><div className="quick-actions"><button onClick={()=>notify("Form requires backend integration.")}><Plus/><span><strong>Create a request</strong><small>Start a new staffing workflow</small></span><ArrowRight/></button><button onClick={()=>setActive(isCorporate?"Workforce roster":isCustomer?"Find workers":isWorker?"Find work":"Verification")}><Search/><span><strong>{isWorker?"Find work":isCustomer?"Find workers":isCorporate?"View workforce":"Review verification"}</strong><small>Open the relevant workspace</small></span><ArrowRight/></button><button onClick={()=>notify("Report export uses demo data.")}><Download/><span><strong>Export a report</strong><small>Download an illustrative report</small></span><ArrowRight/></button></div></section></div><section className="panel"><div className="panel-heading"><div><h2>Recent workforce activity</h2><p>Sample activity for the demo environment.</p></div><button className="text-link" onClick={()=>notify("All activity shown is simulated.")}>View activity <ArrowRight size={14}/></button></div><div className="activity-feed"><div className="feed-icon green"><CheckCircle2/></div><div><strong>Shift marked completed</strong><p>A sample assignment was marked complete.</p></div><time>12 min ago</time><span className="status-pill completed"><i/>Completed</span></div><div className="activity-feed"><div className="feed-icon orange"><FileCheck2/></div><div><strong>Worker verification pending</strong><p>A profile needs authorized document review.</p></div><time>38 min ago</time><span className="status-pill verification-pending"><i/>Needs review</span></div><div className="activity-feed"><div className="feed-icon blue"><Wallet/></div><div><strong>Payroll record updated</strong><p>A simulated payroll record is awaiting approval.</p></div><time>1 hr ago</time><span className="status-pill scheduled"><i/>Pending</span></div></section></>;
}