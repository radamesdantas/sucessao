'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMentee } from '@/hooks/useLocalStorage';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  MessageSquare,
  Users,
  Trophy,
  FolderKanban,
  BarChart3,
  GraduationCap,
  ArrowLeftRight,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/modulos', label: 'Gestao', icon: BookOpen },
  { href: '/cces', label: 'Comportamentos', icon: Target },
  { href: '/checkins', label: 'Check-ins', icon: MessageSquare },
  { href: '/network', label: 'Network', icon: Users },
  { href: '/desafios', label: 'Desafios', icon: Trophy },
  { href: '/projetos', label: 'Projetos', icon: FolderKanban },
  { href: '/metricas', label: 'Metricas', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { mentee, setMenteeId } = useMentee();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Jornada</h1>
          <p className="text-xs text-zinc-500">Protagonista</p>
        </div>
      </div>
      {mentee && (
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 flex-shrink-0">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{mentee.name}</p>
              {mentee.company && (
                <p className="text-[10px] text-zinc-600 truncate">{mentee.company}</p>
              )}
            </div>
            <button
              onClick={() => setMenteeId(null)}
              className="text-zinc-600 hover:text-blue-400 transition-colors flex-shrink-0"
              title="Trocar mentorado"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 px-4 py-3">
        <p className="text-[10px] text-zinc-600 text-center">Programa de Sucessao v1.0</p>
      </div>
    </aside>
  );
}
