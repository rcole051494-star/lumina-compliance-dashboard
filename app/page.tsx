'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Cloud,
  Download,
  FileCheck2,
  FileJson,
  FileText,
  FolderLock,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Timer,
  Upload,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

const controls = [
  { id: 'CC6.1', title: 'Logical and physical access controls', domain: 'Access Control', severity: 'High', status: 'Compliant', audited: 'Sep 20, 2026', evidence: 'access_review_q3.pdf', note: 'Quarterly access review completed with no exceptions. MFA enforced for all privileged roles.' },
  { id: 'CC6.2', title: 'User registration and authorization', domain: 'Access Control', severity: 'High', status: 'In Progress', audited: 'Sep 18, 2026', evidence: 'mfa_policy_v2.docx', note: 'Reviewing joiner / mover / leaver automation across production systems.' },
  { id: 'AC-2', title: 'Account management', domain: 'Access Control', severity: 'Medium', status: 'Compliant', audited: 'Sep 15, 2026', evidence: 'account_inventory.csv', note: 'Automated lifecycle controls are active in Okta and AWS IAM.' },
  { id: 'RA-3', title: 'Risk assessment', domain: 'Risk Assessment', severity: 'High', status: 'In Progress', audited: 'Sep 12, 2026', evidence: 'risk_register_2026.xlsx', note: 'Annual enterprise risk assessment is in final stakeholder review.' },
  { id: 'IR-4', title: 'Incident handling', domain: 'Incident Response', severity: 'Critical', status: 'Non-Compliant', audited: 'Sep 09, 2026', evidence: 'incident_runbook.pdf', note: 'Tabletop exercise evidence is missing for the current audit period.' },
  { id: 'SC-13', title: 'Cryptographic protection', domain: 'Cryptography', severity: 'High', status: 'Compliant', audited: 'Sep 05, 2026', evidence: 'encryption_standard.pdf', note: 'Data at rest and in transit encryption verified across scoped assets.' },
  { id: 'CC8.1', title: 'Change management', domain: 'Change Management', severity: 'Medium', status: 'Compliant', audited: 'Aug 30, 2026', evidence: 'change_log_august.csv', note: 'All sampled production changes include approval and rollback plans.' },
]

const files = [
  { name: 'access_review_q3.pdf', type: 'PDF', size: '2.4 MB', control: 'CC6.1', date: 'Sep 20, 2026', tone: 'rose' },
  { name: 'mfa_policy_v2.docx', type: 'DOCX', size: '184 KB', control: 'CC6.2', date: 'Sep 18, 2026', tone: 'blue' },
  { name: 'aws_cloudtrail_logs.json', type: 'JSON', size: '18.6 MB', control: 'CC7.2', date: 'Sep 17, 2026', tone: 'amber' },
  { name: 'risk_register_2026.xlsx', type: 'XLSX', size: '692 KB', control: 'RA-3', date: 'Sep 12, 2026', tone: 'emerald' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'SOC 2 Criteria', icon: ShieldCheck },
  { label: 'NIST 800-53', icon: Network },
  { label: 'Evidence Locker', icon: FolderLock },
  { label: 'Executive Report', icon: BarChart3 },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Compliant: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
    'In Progress': 'border-amber-500/25 bg-amber-500/10 text-amber-400',
    'Non-Compliant': 'border-rose-500/25 bg-rose-500/10 text-rose-400',
    'Not Applicable': 'border-slate-500/25 bg-slate-500/10 text-slate-400',
  }
  return <Badge variant="outline" className={`gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${styles[status]}`}><span className={`size-1.5 rounded-full ${status === 'Compliant' ? 'bg-emerald-400' : status === 'In Progress' ? 'bg-amber-400' : status === 'Non-Compliant' ? 'bg-rose-400' : 'bg-slate-400'}`} />{status}</Badge>
}

export default function Page() {
  const [framework, setFramework] = useState('SOC 2')
  const [activeNav, setActiveNav] = useState('Overview')
  const [expanded, setExpanded] = useState<string | null>('CC6.1')
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleControls = useMemo(() => controls.filter((control) => `${control.id} ${control.title} ${control.domain}`.toLowerCase().includes(search.toLowerCase())), [search])
  const counts = useMemo(() => {
    const all = controls.map((c) => statuses[c.id] || c.status)
    return { compliant: all.filter((s) => s === 'Compliant').length, progress: all.filter((s) => s === 'In Progress').length, non: all.filter((s) => s === 'Non-Compliant').length, na: all.filter((s) => s === 'Not Applicable').length }
  }, [statuses])
  const score = Math.round((counts.compliant / controls.length) * 100)

  const exportReport = () => {
    const report = { generatedAt: new Date().toISOString(), framework: `${framework} ${framework === 'SOC 2' ? 'Type II' : 'Rev 5'}`, score, counts, findings: controls.map((c) => ({ ...c, status: statuses[c.id] || c.status })) }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'compliance-audit-report.json'; anchor.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#07111d] text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-slate-800/80 bg-[#091522] transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-800/80 px-6"><div className="flex size-8 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,.22)]"><ShieldCheck className="size-5" /></div><div><p className="text-sm font-semibold tracking-tight">Aegis<span className="text-cyan-400">Audit</span></p><p className="text-[10px] font-medium uppercase tracking-[.18em] text-slate-500">Compliance OS</p></div></div>
        <div className="px-4 pt-7"><p className="px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-600">Workspace</p><nav className="mt-3 flex flex-col gap-1">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActiveNav(label); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${activeNav === label ? 'bg-cyan-400/10 font-medium text-cyan-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}><Icon className="size-[17px]" />{label}{label === 'Evidence Locker' && <span className="ml-auto rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">24</span>}</button>)}</nav></div>
        <div className="mt-auto border-t border-slate-800/80 p-4"><div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/40 p-3"><div className="flex size-8 items-center justify-center rounded-full bg-slate-700 text-slate-300"><UserRound className="size-4" /></div><div className="min-w-0"><p className="truncate text-xs font-medium">Jordan Lee</p><p className="truncate text-[10px] text-slate-500">Security Admin</p></div><MoreHorizontal className="ml-auto size-4 text-slate-500" /></div><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-slate-300"><Settings2 className="size-4" />Workspace settings</button></div>
      </aside>
      {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
      <main className="lg:pl-[248px]">
        <header className="flex h-[74px] items-center justify-between border-b border-slate-800/80 px-5 sm:px-8"><div className="flex items-center gap-3"><Button aria-label="Open menu" variant="ghost" size="icon" className="text-slate-400 lg:hidden" onClick={() => setMobileOpen(true)}><Menu /></Button><div><p className="text-xs text-slate-500">Workspace / <span className="text-slate-300">{activeNav}</span></p><h1 className="mt-1 text-lg font-semibold tracking-tight">{activeNav === 'Overview' ? 'Compliance overview' : activeNav}</h1></div></div><div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-500 sm:flex"><Activity className="size-3.5 text-emerald-400" />Last synced 4m ago</div><Button variant="outline" size="sm" className="hidden border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 sm:flex" onClick={exportReport}><Download data-icon="inline-start" />Export report</Button><Button variant="ghost" size="icon" className="text-slate-400"><CircleHelp /></Button></div></header>
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
          {activeNav === 'Evidence Locker' ? <EvidenceLocker /> : activeNav === 'Executive Report' ? <ExecutiveReport score={score} counts={counts} onExport={exportReport} /> : <>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" /><span className="text-xs font-medium text-emerald-400">Audit active</span><span className="text-xs text-slate-600">•</span><span className="text-xs text-slate-500">Period ending Dec 31, 2026</span></div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Control center</h2><p className="mt-1 text-sm text-slate-500">Monitor controls, evidence, and remediation across your compliance programs.</p></div><div className="flex rounded-lg border border-slate-800 bg-slate-900/70 p-1"><button onClick={() => setFramework('SOC 2')} className={`rounded-md px-3 py-2 text-xs font-medium transition ${framework === 'SOC 2' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>SOC 2 Type II</button><button onClick={() => setFramework('NIST')} className={`rounded-md px-3 py-2 text-xs font-medium transition ${framework === 'NIST' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>NIST SP 800-53</button></div></div>
            <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_2fr]"><Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardContent className="flex items-center gap-7 p-5 sm:p-6"><div className="relative flex size-[126px] shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#22d3ee ${score * 3.6}deg, #183044 0deg)` }}><div className="flex size-[104px] flex-col items-center justify-center rounded-full bg-[#0b1a29]"><span className="text-3xl font-semibold text-slate-100">{score}%</span><span className="text-[10px] uppercase tracking-wider text-slate-500">Overall score</span></div></div><div><p className="text-xs font-medium text-slate-400">{framework === 'SOC 2' ? 'SOC 2 Type II' : 'NIST SP 800-53 Rev 5'}</p><p className="mt-1 text-sm font-semibold text-slate-200">Security & availability</p><div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400"><ArrowUpRight className="size-3.5" />+4.2% from last audit</div></div></CardContent></Card><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><Metric label="Compliant" value={counts.compliant} total={controls.length} color="emerald" icon={Check} /><Metric label="In progress" value={counts.progress} total={controls.length} color="amber" icon={Timer} /><Metric label="Non-compliant" value={counts.non} total={controls.length} color="rose" icon={AlertTriangle} /><Metric label="Not applicable" value={counts.na} total={controls.length} color="slate" icon={X} /></div></div>
            <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="text-base font-semibold">Control checklist</h3><p className="mt-1 text-xs text-slate-500">{controls.length} controls across 5 domains</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-slate-600" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search controls..." className="h-9 w-full border-slate-800 bg-slate-900/70 pl-9 text-xs placeholder:text-slate-600 sm:w-56" /></div><Button variant="outline" size="sm" className="h-9 border-slate-800 bg-slate-900/70 text-xs text-slate-400"><Plus data-icon="inline-start" />Add control</Button></div></div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80 bg-[#0b1826]"><div className="hidden grid-cols-[1.2fr_2.2fr_1fr_1fr_1fr_32px] gap-4 border-b border-slate-800/80 px-5 py-3 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600 md:grid"><span>Control ID</span><span>Control objective</span><span>Severity</span><span>Status</span><span>Last audited</span><span /></div>{visibleControls.map((control) => <div key={control.id} className="border-b border-slate-800/70 last:border-0"><div className="grid items-center gap-3 px-5 py-4 md:grid-cols-[1.2fr_2.2fr_1fr_1fr_1fr_32px] md:gap-4"><div><span className="font-mono text-xs font-medium text-cyan-400">{control.id}</span><p className="mt-1 text-[11px] text-slate-600 md:hidden">{control.domain}</p></div><div><p className="text-sm text-slate-300">{control.title}</p><p className="mt-1 hidden text-[11px] text-slate-600 md:block">{control.domain}</p></div><div><Badge variant="outline" className={`rounded-md text-[10px] ${control.severity === 'Critical' ? 'border-rose-500/30 text-rose-400' : control.severity === 'High' ? 'border-amber-500/30 text-amber-400' : 'border-slate-700 text-slate-500'}`}>{control.severity}</Badge></div><div><Select value={statuses[control.id] || control.status} onValueChange={(value) => setStatuses((prev) => ({ ...prev, [control.id]: value }))}><SelectTrigger className="h-7 w-[132px] border-0 bg-transparent p-0 text-xs shadow-none focus:ring-0"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Compliant">Compliant</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Non-Compliant">Non-Compliant</SelectItem><SelectItem value="Not Applicable">Not Applicable</SelectItem></SelectContent></Select></div><span className="text-xs text-slate-500">{control.audited}</span><button aria-label={`Expand ${control.id}`} onClick={() => setExpanded(expanded === control.id ? null : control.id)} className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-cyan-300">{expanded === control.id ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}</button></div>{expanded === control.id && <div className="mx-5 mb-4 rounded-lg border border-cyan-500/10 bg-[#091521] px-4 py-3 md:ml-[calc(20%+1rem)]"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">Implementation notes</p><p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">{control.note}</p></div><div className="shrink-0"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">Linked evidence</p><button className="mt-1 flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300"><FileText className="size-3.5" />{control.evidence}<ArrowUpRight className="size-3" /></button></div></div></div>}</div>)}</div>
          </>
        }
        </div>
      </main>
    </div>
  )
}

function Metric({ label, value, total, color, icon: Icon }: { label: string; value: number; total: number; color: string; icon: typeof Check }) { const text: Record<string, string> = { emerald: 'text-emerald-400', amber: 'text-amber-400', rose: 'text-rose-400', slate: 'text-slate-400' }; const bar: Record<string, string> = { emerald: 'bg-emerald-400', amber: 'bg-amber-400', rose: 'bg-rose-400', slate: 'bg-slate-500' }; return <Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardContent className="p-4"><div className={`flex size-7 items-center justify-center rounded-md bg-slate-800/80 ${text[color]}`}><Icon className="size-3.5" /></div><p className="mt-4 text-2xl font-semibold text-slate-100">{value}<span className="text-sm font-normal text-slate-600">/{total}</span></p><p className="mt-1 text-[11px] text-slate-500">{label}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${bar[color]}`} style={{ width: `${Math.max(value / total * 100, value ? 8 : 0)}%` }} /></div></CardContent></Card> }

function EvidenceLocker() { return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><FolderLock className="size-3.5 text-cyan-400" />Central evidence repository</div><h2 className="text-2xl font-semibold tracking-tight">Evidence locker</h2><p className="mt-1 text-sm text-slate-500">Artifacts mapped to controls and ready for auditor review.</p></div><Button className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"><Upload data-icon="inline-start" />Upload evidence</Button></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardContent className="p-5"><p className="text-xs text-slate-500">Total artifacts</p><p className="mt-2 text-3xl font-semibold">24</p><p className="mt-1 text-xs text-emerald-400">+3 this month</p></CardContent></Card><Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardContent className="p-5"><p className="text-xs text-slate-500">Storage used</p><p className="mt-2 text-3xl font-semibold">1.8 <span className="text-sm font-normal text-slate-500">GB</span></p><Progress value={36} className="mt-3 h-1 bg-slate-800" /></CardContent></Card><Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardContent className="p-5"><p className="text-xs text-slate-500">Controls covered</p><p className="mt-2 text-3xl font-semibold">92<span className="text-sm font-normal text-slate-500">%</span></p><p className="mt-1 text-xs text-amber-400">2 need evidence</p></CardContent></Card></div><div className="mt-8 overflow-hidden rounded-xl border border-slate-800/80 bg-[#0b1826]"><div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4"><h3 className="text-sm font-semibold">Recent artifacts</h3><Button variant="ghost" size="sm" className="text-xs text-slate-500">View all <ArrowUpRight data-icon="inline-end" /></Button></div>{files.map((file) => <div key={file.name} className="flex flex-col gap-3 border-b border-slate-800/70 px-5 py-4 last:border-0 sm:flex-row sm:items-center"><div className={`flex size-9 items-center justify-center rounded-lg ${file.tone === 'rose' ? 'bg-rose-500/10 text-rose-400' : file.tone === 'blue' ? 'bg-blue-500/10 text-blue-400' : file.tone === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}><FileText className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm text-slate-300">{file.name}</p><p className="mt-1 text-[11px] text-slate-600">{file.type} · {file.size} · uploaded {file.date}</p></div><Badge variant="outline" className="w-fit border-cyan-500/20 bg-cyan-500/5 font-mono text-[10px] text-cyan-400">{file.control}</Badge><Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-300"><Download /></Button></div>)}</div></div> }

function ExecutiveReport({ score, counts, onExport }: { score: number; counts: { compliant: number; progress: number; non: number; na: number }; onExport: () => void }) { return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><BarChart3 className="size-3.5 text-cyan-400" />Management review</div><h2 className="text-2xl font-semibold tracking-tight">Executive summary</h2><p className="mt-1 text-sm text-slate-500">A concise view of audit health, findings, and remediation priorities.</p></div><Button onClick={onExport} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"><FileJson data-icon="inline-start" />Generate audit report</Button></div><div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]"><Card className="border-slate-800/80 bg-[#0b1a29] shadow-none"><CardHeader><CardTitle className="text-sm">Audit health</CardTitle></CardHeader><CardContent><div className="flex items-end gap-3"><span className="text-5xl font-semibold text-cyan-300">{score}%</span><span className="mb-2 text-xs text-emerald-400">Healthy posture</span></div><Progress value={score} className="mt-5 h-2 bg-slate-800" /><div className="mt-5 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4"><div><p className="text-2xl font-semibold text-emerald-400">{counts.compliant}</p><p className="mt-1 text-slate-500">Compliant</p></div><div><p className="text-2xl font-semibold text-amber-400">{counts.progress}</p><p className="mt-1 text-slate-500">Open work</p></div><div><p className="text-2xl font-semibold text-rose-400">{counts.non}</p><p className="mt-1 text-slate-500">Findings</p></div><div><p className="text-2xl font-semibold text-slate-400">{counts.na}</p><p className="mt-1 text-slate-500">N/A</p></div></div></CardContent></Card><Card className="border-rose-500/15 bg-rose-500/[.04] shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle className="size-4 text-rose-400" />Priority remediation</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-slate-400">Incident response tabletop exercise evidence is missing for the current audit period.</p><div className="mt-5 flex items-center justify-between"><Badge className="border-rose-500/20 bg-rose-500/10 text-rose-400" variant="outline">Critical</Badge><Button variant="ghost" size="sm" className="text-xs text-cyan-400">Open finding <ArrowUpRight data-icon="inline-end" /></Button></div></CardContent></Card></div><Card className="mt-4 border-slate-800/80 bg-[#0b1a29] shadow-none"><CardHeader><CardTitle className="text-sm">Report contents</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><ReportItem icon={ClipboardCheck} title="Control assessment" detail="7 controls evaluated" /><ReportItem icon={FolderLock} title="Evidence index" detail="24 artifacts linked" /><ReportItem icon={Zap} title="Remediation plan" detail="2 actions open" /></CardContent></Card></div> }

function ReportItem({ icon: Icon, title, detail }: { icon: typeof ClipboardCheck; title: string; detail: string }) { return <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"><Icon className="size-4 text-cyan-400" /><div><p className="text-xs font-medium text-slate-300">{title}</p><p className="mt-1 text-[11px] text-slate-600">{detail}</p></div></div> }
