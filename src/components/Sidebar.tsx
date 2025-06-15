import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IconHome,
  IconMap,
  IconFileText,
  IconShieldLock,
  IconLogout,
  IconUser,
  IconMenu2,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import { auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import logo from "../assets/logo.png";
import only_logo from "../assets/only_logo.png";

export default function Sidebar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {/* Botão hamburguer e nome da plataforma no mobile */}
      {!mobileOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-9998 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white bg-gray-900 p-2 rounded shadow-lg"
          >
            <IconMenu2 size={24} />
          </button>

          {/* Texto forte e impactante */}
          <span
            className="text-3xl font-black tracking-tight leading-none font-[Righteous] bg-white px-3 py-1 rounded-t-xl border-b border-gray-300"
            style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="text-gray-900">Aler</span>
            <span className="text-orange-600">THE</span>
          </span>
        </div>
      )}

      {/* Overlay escuro no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          z-9999 fixed top-0 left-0 z-40 h-screen bg-gray-900 text-white shadow-lg transition-transform duration-300 flex flex-col
          ${expanded ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Cabeçalho com logo e botão */}
        <div
          className={`flex items-center px-4 py-4 border-b border-gray-800 ${
            expanded || mobileOpen ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={only_logo}
              alt="Logo"
              className={expanded || mobileOpen ? "h-10" : "h-8"}
            />
            {(expanded || mobileOpen) && (
              <span
                className="text-2xl font-black tracking-tight leading-none font-[Righteous] text-white"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              >
                <span className="text-white">Aler</span>
                <span className="text-orange-500">THE</span>
              </span>
            )}
          </div>

          {expanded || mobileOpen ? (
            <button
              onClick={() =>
                window.innerWidth < 1024
                  ? setMobileOpen(false)
                  : setExpanded(false)
              }
              className="text-white hover:text-blue-300 transition"
            >
              <IconChevronLeft size={20} />
            </button>
          ) : (
            <button
              onClick={() =>
                window.innerWidth < 1024
                  ? setMobileOpen(true)
                  : setExpanded(true)
              }
              className="absolute right-2 text-white hover:text-blue-300 transition"
            >
              <IconChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex flex-col mt-4 space-y-2">
          <SidebarLink
            to="/"
            icon={<IconHome size={22} />}
            expanded={expanded}
            mobileOpen={mobileOpen}
            onClick={() => setMobileOpen(false)}
          >
            Início
          </SidebarLink>

          <SidebarLink
            to="/report"
            icon={<IconPlus size={22} />}
            expanded={expanded}
            mobileOpen={mobileOpen}
            onClick={() => setMobileOpen(false)}
          >
            Nova Ocorrência
          </SidebarLink>

          <SidebarLink
            to="/map"
            icon={<IconMap size={22} />}
            expanded={expanded}
            mobileOpen={mobileOpen}
            onClick={() => setMobileOpen(false)}
          >
            Mapa
          </SidebarLink>

          <SidebarLink
            to="/terms"
            icon={<IconFileText size={22} />}
            expanded={expanded}
            mobileOpen={mobileOpen}
            onClick={() => setMobileOpen(false)}
          >
            Termos
          </SidebarLink>

          <SidebarLink
            to="/privacy"
            icon={<IconShieldLock size={22} />}
            expanded={expanded}
            mobileOpen={mobileOpen}
            onClick={() => setMobileOpen(false)}
          >
            Privacidade
          </SidebarLink>
        </nav>

        {/* Rodapé com usuário e logout */}
        <div className="mt-auto border-t border-gray-800 px-4 py-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <IconUser size={18} />
            {(expanded || mobileOpen) && (
              <div>
                <p className="font-semibold">{user?.displayName}</p>
                <p className="text-xs text-gray-300 break-all">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-600 transition"
          >
            <IconLogout size={18} />
            {(expanded || mobileOpen) && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

// Componente reutilizável para links
function SidebarLink({
  to,
  icon,
  children,
  expanded,
  mobileOpen,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: string;
  expanded: boolean;
  mobileOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center ${
          expanded || mobileOpen ? "justify-start" : "justify-center"
        } gap-3 px-4 py-2 hover:bg-gray-800 transition ${
          isActive ? "bg-gray-800 font-semibold text-blue-400" : "text-gray-200"
        }`
      }
    >
      {icon}
      {(expanded || mobileOpen) && <span>{children}</span>}
    </NavLink>
  );
}
