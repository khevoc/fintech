import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// NOTA: Se asume que /logo.png existe
import logo from "/logo.png";

// --- DATOS DE PRUEBA AMPLIADOS ---
const initialChartData = [
  { day: "Mon", value: 125.0, pv: 140.0, amt: 2400 },
  { day: "Tue", value: 129.5, pv: 135.0, amt: 2210 },
  { day: "Wed", value: 127.2, pv: 142.0, amt: 2290 },
  { day: "Thu", value: 131.8, pv: 145.0, amt: 2000 },
  { day: "Fri", value: 134.4, pv: 148.0, amt: 2181 },
  { day: "Sat", wvalue: 136.2, pv: 152.0, amt: 2500 },
  { day: "Sun", value: 139.8, pv: 158.0, amt: 2100 },
];

const initialBankAccounts = [
  { id: "CL-001", name: "Operating - Clearo Bank", balance: 125400.0, currency: "USD", status: "Active" },
  { id: "CL-002", name: "Reserve - Global Trust", balance: 54000.0, currency: "USD", status: "Active" },
  { id: "CL-003", name: "Payroll - CitiBank NA", balance: 12500.5, currency: "USD", status: "Verified" },
  { id: "CL-004", name: "EUR Main - Deutsche", balance: 45000.0, currency: "EUR", status: "Active" },
];

const initialCards = [
  { id: "CARD-01", holder: "Clearo Corporate", type: "Debit", limit: 0, status: "Active" },
  { id: "CARD-02", holder: "Vendor Card", type: "Corporate Credit", limit: 50000, status: "Active" },
  { id: "CARD-03", holder: "Marketing Spend", type: "Virtual Debit", limit: 5000, status: "Locked" },
];

const initialLoans = [
  { id: "LN-1001", borrower: "Acme Real Estate", amount: 250000, type: "Commercial Mortgage", rate: "4.5%", status: "Active" },
  { id: "LN-1002", borrower: "GreenBuild Ltd.", amount: 120000, type: "Working Capital", rate: "7.2%", status: "Pending" },
  { id: "LN-1003", borrower: "Tech Startup Inc.", amount: 80000, type: "Convertible Note", rate: "N/A", status: "Funded" },
];

const initialEscrows = [
  { id: "ESC-9001", parties: "Seller A ↔ Buyer B", object: "Apartment 12B", amount: 245000, status: "Held" },
  { id: "ESC-9002", parties: "Contractor ↔ Client Z", object: "Software Dev. Milestone 1", amount: 15000, status: "Released" },
  { id: "ESC-9003", parties: "Fund C ↔ Asset D", object: "Security Token Sale", amount: 1000000, status: "Pending Deposit" },
];

const initialTrades = [
  { id: "TR-3001", type: "Seller", object: "Apartment 12B", amount: 185000, status: "Draft" },
  { id: "TR-3002", type: "Buyer", object: "Warehouse #7", amount: 420000, status: "Negotiation" },
  { id: "TR-3003", type: "Seller", object: "Land Parcel Z", amount: 95000, status: "Complete" },
];

const initialFactoryContracts = [
  { id: "FAC-01", title: "Mortgage Pool Factory", status: "Active", assets: 450 },
  { id: "FAC-02", title: "Securitized Receivables", status: "Setup", assets: 0 },
];

const initialAdvancePaymentOffers = [
  { id: "ADV-1", description: "2% discount for settlement within 7 days (Invoice #456)", discountPct: 2, amount: 12500, due: "2025-12-01" },
  { id: "ADV-2", description: "5% early pay discount (Vendor A, Q4 Contracts)", discountPct: 5, amount: 45000, due: "2026-01-15" },
];

const initialReleasePayments = [
  { id: "REL-101", from: "Buyer B", to: "Seller A", amount: 12000, status: "Awaiting Approval", esc: "ESC-9001" },
  { id: "REL-102", from: "Client Z", to: "Contractor", amount: 5000, status: "Pending Release", esc: "ESC-9002" },
];

// Datos de Notificaciones y Actividad (Mejorados)
const initialNotifications = [
  { id: 1, type: 'release', title: 'Payment Approval Required', detail: 'Release $12,000 for Escrow ESC-9001', time: '5m ago' },
  { id: 2, type: 'transfer', title: 'Transfer Complete', detail: 'Received $25,000 from Acme Corp.', time: '1h ago' },
  { id: 3, type: 'account', title: 'Account Verified', detail: 'Payroll - CitiBank NA account confirmed.', time: '3h ago' },
  { id: 4, type: 'alert', title: 'Card Limit Reached', detail: 'Marketing Spend Card is at 98% usage.', time: '1d ago' },
];

const initialPendingActions = [
  { id: 'appr-1', type: 'release', title: 'Escrow Release', detail: 'Approve $12,000 to Seller A', targetId: 'REL-101' },
  { id: 'appr-2', type: 'contract', title: 'Finalize Contract', detail: 'Review Mortgage Pool Factory setup', targetId: 'FAC-02' },
  { id: 'appr-3', type: 'advance', title: 'Advance Offer', detail: 'Accept 2% discount on Invoice #456', targetId: 'ADV-1' },
];


// --- COLORES MEJORADOS Y PROFESIONALES ---
const COLORS = {
  // Base Corporativo (Dark Theme)
  deepBlue: "#0B111A", // Fondo oscuro (más profundo)
  cardDark: "#1A2433", // Fondo tarjeta oscuro (más contraste y elegancia)

  // Accent Principal (Azul Zafiro, profesional y de confianza)
  teal: "#007AFF", // Azul profesional, similar a iOS/SaaS
  tealLight: "#34C759", // Verde/Cyan para contrastes

  // Light Theme (Paleta limpia y formal)
  lightBg: "#FFFFFF", // Fondo claro limpio
  cardLight: "#F8FAFC", // Fondo tarjeta light (un toque de contraste)
  textDark: "#1F2937", // Texto oscuro (gris oscuro, no negro puro)
  lightBorder: "#E5E7EB", // Borde claro suave

  // Colores de estado y utilidad
  statusSuccess: "#34C759", // Éxito (Verde Apple)
  statusWarning: "#FF9500", // Advertencia (Naranja)
  statusDanger: "#FF3B30", // Peligro (Rojo)
  accentSecondary: "#4B5563", // Color secundario para detalles/ejes
  textLight: "#F8F9FA", // Texto claro
};


// --- ICONOS PROFESIONALES (Símbolos unicode) ---
const ICONS = {
  home: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>,
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>, // Home
  bankaccounts: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><path d="M10 12l2-7 2 7"/><path d="M12 2v7"/><path d="M12 22v-7"/><path d="M16 16v-2"/><path d="M8 16v-2"/></svg>,
  cards: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  loans: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 18 11 14 7 2 19"/><polyline points="18 7 22 7 22 11"/></svg>,
  escrow: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  release: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14 9 11"/></svg>,
  trades: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18V3h18"/><path d="M7 12h3"/><path d="M7 16h3"/><path d="M14 12h3"/><path d="M14 16h3"/><path d="M10 21v-3"/></svg>,
  factory: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 1-2 2h24a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2h-8l-2 2h-4l-2-2H4a2 2 0 0 0-2 2v16z"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>,
  advance: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.08"/><line x1="16" y1="13" x2="16" y2="17"/></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  faq: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,

  // Actividad/Notificaciones
  releaseAction: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  transfer: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2v10"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 0-2-2v-5"/></svg>,
  account: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  alert: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  contract: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
  cashflow: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17l-4.5-4.5L9 17L3 11"/></svg>,
  total: 'Σ',
};


// --- UTILIDADES ---
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


// --- COMPONENTE MENU ITEM (Optimizado con Iconos y Corrección de Animación) ---
const MenuItem = ({ id, active, onClick, label, hint, icon }) => {
  const isActive = active === id;
  // CAMBIO CLAVE: Usar un color transparente #00000000 para inicialización
  const initialBg = isActive ? "var(--teal-light-alpha)" : "#00000000"; 
  const hoverBg = isActive ? "var(--teal-light-alpha-hover)" : "var(--hover-bg)";
  const activeBorder = isActive ? `1px solid ${COLORS.teal}` : "1px solid transparent";
  const activeColor = isActive ? COLORS.teal : "inherit";

  return (
    <motion.div
      className="menu-item"
      role="menuitem"
      tabIndex={0}
      onClick={() => onClick(id)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(id);
      }}
      // transition mejorada (spring) para un toque más profesional
      transition={{ type: "spring", stiffness: 400, damping: 25 }} 
      // background se define en initial y whileHover para la animación
      initial={{ backgroundColor: initialBg }} 
      whileHover={{ backgroundColor: hoverBg, x: 4 }} // Efecto de deslizamiento moderno
      style={{
        border: activeBorder,
        color: activeColor,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "1.05rem", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span> {label}
      </div>
      <div className="tiny" style={{ opacity: 0.7, color: isActive ? COLORS.teal : "var(--muted-color)" }}>{hint}</div>
    </motion.div>
  );
};


// --- COMPONENTE NOTIFICACIÓN / ACCIÓN PENDIENTE (Optimizado) ---
const ActivityItem = ({ type, title, detail, time, onClick, statusColor, actionIcon }) => {

  const icon = actionIcon || ICONS[type] || 'ⓘ'; // Icono por defecto

  let color = statusColor || COLORS.accentSecondary;
  if (type === 'release' || type === 'contract' || type === 'advance') color = COLORS.statusWarning;
  if (type === 'transfer' || type === 'account') color = COLORS.statusSuccess;
  if (type === 'alert') color = COLORS.statusDanger;

  const iconStyle = {
    fontSize: "1.3rem",
    color: color,
    minWidth: '24px',
    textAlign: 'center'
  };

  return (
    <motion.div
      className="activity-item"
      onClick={onClick}
      // Efecto de brillo/glow en hover para profesionalismo
      whileHover={{ scale: 1.02, backgroundColor: 'var(--hover-bg-subtle)', boxShadow: '0 4px 15px rgba(0, 122, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0", // Más espacio vertical
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        transition: "background 0.2s ease"
      }}
    >
      <div style={iconStyle}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{title}</div>
        <div className="tiny muted" style={{ marginTop: 2, opacity: 0.8 }}>{detail}</div>
      </div>
      {time && <div className="tiny muted" style={{ minWidth: 40, textAlign: 'right', opacity: 0.6 }}>{time}</div>}
    </motion.div>
  );
};

// --- NUEVO COMPONENTE: DataBox para Métricas Clave ---
const DataBox = ({ title, value, icon, color }) => (
  <motion.div
    className="card data-box"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: 16, // Padding ligeramente aumentado
      margin: '5px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxShadow: 'none', 
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default' // Indicador de que no es clickeable (a menos que se añada onClick)
    }}
    whileHover={{ 
      boxShadow: `0 4px 20px ${color.replace(')', ', 0.25)')}`, // Sombra más notoria
      borderColor: color,
      transform: 'translateY(-3px)' // Desplazamiento sutil
    }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] , type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className="mini" style={{ color: color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'flex-end', gap: 8, lineHeight: 1.2 }}>
      {value}
    </div>
    <div style={{
      position: 'absolute',
      right: 20,
      top: 20,
      fontSize: '2.8rem', // Icono más grande
      opacity: 0.1, // Opacidad más sutil
      color: color,
      transform: 'rotate(-10deg)',
      pointerEvents: 'none'
    }}>{icon}</div>
  </motion.div>
);

// --- COMPONENTE Tooltip Personalizado para el Gráfico ---
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    const bg = isDark ? COLORS.cardDark : COLORS.cardLight;
    const border = isDark ? 'rgba(255,255,255,0.15)' : COLORS.lightBorder;
    
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: bg,
        padding: '12px',
        border: `1px solid ${border}`,
        borderRadius: '10px',
        boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.1)',
        fontSize: '0.9rem',
        minWidth: 150,
      }}>
        <p className="label" style={{ fontWeight: 600, margin: 0, borderBottom: `1px solid ${border}`, paddingBottom: '8px' }}>{`Day: ${label}`}</p>
        <p className="intro" style={{ margin: '8px 0 0 0', color: COLORS.teal, fontWeight: 600 }}>{`Cash Flow: ${formatCurrency(payload[0].value * 1000)}`}</p>
        <p className="intro" style={{ margin: '2px 0 0 0', color: COLORS.tealLight, fontWeight: 600 }}>{`Target: ${formatCurrency((payload[0].value/2) * 1000)}`}</p>
      </div>
    );
  }

  return null;
};

// --- COMPONENTE VISTA: Cuentas Bancarias ---
const AccountsView = ({ accounts }) => (
  <motion.div 
    key="accounts-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60}}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>🏦 Bank Accounts</h2>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Balance (USD)</th>
            <th>Currency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <motion.tr key={acc.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{acc.id}</td>
              <td>{acc.name}</td>
              <td>{formatCurrency(acc.balance, 'USD')}</td>
              <td>{acc.currency}</td>
              <td>
                <span className={`status-pill ${acc.status.toLowerCase().replace(' ', '')}`}>{acc.status}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Tarjetas ---
const CardsView = ({ cards }) => (
  <motion.div 
    key="cards-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh', marginBottom: 60 }}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.cards} Card Management</h2>
    <div className="grid-3cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Total Cards" 
        value={cards.length.toString()} 
        icon={ICONS.total} 
        color={COLORS.teal}
      />
      <DataBox 
        title="Corporate Credit Limit" 
        value={formatCurrency(cards.filter(c => c.type === 'Corporate Credit').reduce((sum, c) => sum + c.limit, 0))} 
        icon={ICONS.cards} 
        color={COLORS.tealLight}
      />
      <DataBox 
        title="Virtual Cards Locked" 
        value={cards.filter(c => c.status === 'Locked').length.toString()} 
        icon={'🚫'} 
        color={COLORS.statusDanger}
      />
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Holder</th>
            <th>Type</th>
            <th>Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <motion.tr key={card.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{card.id}</td>
              <td>{card.holder}</td>
              <td>{card.type}</td>
              <td>{card.limit > 0 ? formatCurrency(card.limit) : 'N/A'}</td>
              <td>
                <span className={`status-pill ${card.status.toLowerCase().replace(' ', '')}`}>{card.status}</span>
              </td>
              <td><button className="btn mini" onClick={() => alert(`View ${card.id}`)}>View</button></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Préstamos ---
const LoansView = ({ loans }) => (
  <motion.div 
    key="loans-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60 }}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.loans} Loan Management</h2>
    <div className="grid-2cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Active Loan Capital" 
        value={formatCurrency(loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + l.amount, 0))} 
        icon={'💵'} 
        color={COLORS.teal}
      />
      <DataBox 
        title="Pending Loan Applications" 
        value={loans.filter(l => l.status === 'Pending').length.toString()} 
        icon={'⏳'} 
        color={COLORS.statusWarning}
      />
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Borrower</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <motion.tr key={loan.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{loan.id}</td>
              <td>{loan.borrower}</td>
              <td>{formatCurrency(loan.amount)}</td>
              <td>{loan.type}</td>
              <td>{loan.rate}</td>
              <td>
                <span className={`status-pill ${loan.status.toLowerCase().replace(' ', '')}`}>{loan.status}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Escrows (Fideicomisos) ---
const EscrowView = ({ escrows, releasePayments }) => (
  <motion.div 
    key="escrow-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60}}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.escrow} Escrow Services</h2>
    <div className="grid-2cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Total Held in Escrow" 
        value={formatCurrency(escrows.reduce((sum, e) => sum + e.amount, 0))} 
        icon={ICONS.escrow} 
        color={COLORS.teal}
      />
      <DataBox 
        title="Pending Releases" 
        value={releasePayments.filter(r => r.status.includes('Approval') || r.status.includes('Pending')).length.toString()} 
        icon={ICONS.releaseAction} 
        color={COLORS.statusWarning}
      />
    </div>

    <h3>Active Escrows</h3>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Parties</th>
            <th>Object</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {escrows.map((esc) => (
            <motion.tr key={esc.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{esc.id}</td>
              <td>{esc.parties}</td>
              <td>{esc.object}</td>
              <td>{formatCurrency(esc.amount)}</td>
              <td>
                <span className={`status-pill ${esc.status.toLowerCase().replace(' ', '')}`}>{esc.status}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Trades (Operaciones) ---
const TradesView = ({ trades }) => (
  <motion.div 
    key="trades-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60}}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.trades} Trade Facilitation</h2>
    <div className="grid-3cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Total Value (Complete)" 
        value={formatCurrency(trades.filter(t => t.status === 'Complete').reduce((sum, t) => sum + t.amount, 0))} 
        icon={'🎉'} 
        color={COLORS.tealLight}
      />
      <DataBox 
        title="Pending Negotiations" 
        value={trades.filter(t => t.status === 'Negotiation').length.toString()} 
        icon={'🤝'} 
        color={COLORS.statusWarning}
      />
      <DataBox 
        title="Drafts" 
        value={trades.filter(t => t.status === 'Draft').length.toString()} 
        icon={'📄'} 
        color={COLORS.accentSecondary}
      />
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>Object</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <motion.tr key={trade.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{trade.id}</td>
              <td>{trade.type}</td>
              <td>{trade.object}</td>
              <td>{formatCurrency(trade.amount)}</td>
              <td>
                <span className={`status-pill ${trade.status.toLowerCase().replace(' ', '')}`}>{trade.status}</span>
              </td>
              <td><button className="btn mini" onClick={() => alert(`Review ${trade.id}`)}>Review</button></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Contract Factory ---
const ContractFactoryView = ({ factoryContracts }) => (
  <motion.div 
    key="factory-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60}}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.factory} Contract Factory</h2>
    <div className="grid-2cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Total Active Factories" 
        value={factoryContracts.filter(f => f.status === 'Active').length.toString()} 
        icon={'🤖'} 
        color={COLORS.teal}
      />
      <DataBox 
        title="Total Managed Assets" 
        value={factoryContracts.reduce((sum, f) => sum + f.assets, 0).toLocaleString()} 
        icon={'📦'} 
        color={COLORS.tealLight}
      />
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assets</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {factoryContracts.map((contract) => (
            <motion.tr key={contract.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{contract.id}</td>
              <td>{contract.title}</td>
              <td>
                <span className={`status-pill ${contract.status.toLowerCase().replace(' ', '')}`}>{contract.status}</span>
              </td>
              <td>{contract.assets.toLocaleString()}</td>
              <td><button className="btn mini cta" onClick={() => alert(`Manage ${contract.id}`)}>Manage</button></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE VISTA: Advance Payment Offers ---
const AdvanceOffersView = ({ advancePaymentOffers }) => (
  <motion.div 
    key="advance-view" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }} 
    transition={{ duration: 0.4 }}
    className="card" 
    style={{ minHeight: '60vh' , marginBottom: 60}}
  >
    <h2 style={{marginTop: 0, marginBottom: 20}}>{ICONS.advance} Advance Payment Offers</h2>
    <div className="grid-3cols" style={{ marginBottom: 32 }}>
      <DataBox 
        title="Total Offer Value" 
        value={formatCurrency(advancePaymentOffers.reduce((sum, o) => sum + o.amount, 0))} 
        icon={'💵'} 
        color={COLORS.teal}
      />
      <DataBox 
        title="Max Potential Discount" 
        value={formatCurrency(advancePaymentOffers.reduce((sum, o) => sum + (o.amount * o.discountPct / 100), 0), 'USD')} 
        icon={'📉'} 
        color={COLORS.tealLight}
      />
      <DataBox 
        title="Offers Available" 
        value={advancePaymentOffers.length.toString()} 
        icon={'🏷️'} 
        color={COLORS.statusWarning}
      />
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Discount</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {advancePaymentOffers.map((offer) => (
            <motion.tr key={offer.id} whileHover={{ backgroundColor: 'var(--hover-bg-subtle)' }}>
              <td>{offer.id}</td>
              <td>{offer.description}</td>
              <td><span className="pill dark-text">{offer.discountPct}%</span></td>
              <td>{formatCurrency(offer.amount)}</td>
              <td>{offer.due}</td>
              <td><button className="btn mini cta" onClick={() => alert(`Accept Offer ${offer.id}`)}>Accept</button></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- COMPONENTE DASHBOARD (Contenido principal) ---
const DashboardContent = ({ totalBalance, totalEscrowHeld, totalPendingLoans, chartData, theme, currentChartType, setCurrentChartType, notifications, pendingActions }) => {
  const isDark = theme === 'dark';
  const axisColor = isDark ? 'rgba(255,255,255,0.4)' : COLORS.accentSecondary;
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : COLORS.lightBorder;
  const textFill = isDark ? COLORS.textLight : COLORS.textDark;

  return (
    <motion.div 
      key="dashboard-view" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} 
      style={{ animationDelay: '0.1s' }}
    >
      <h1 style={{marginTop: 0, fontWeight: 800, fontSize: '2.5rem'}}>Welcome back, John!</h1>
      <p className="muted" style={{marginBottom: 32}}>A high-level overview of your finance operations.</p>
      
      {/* Métrica Global Grid */}
      <div className="grid-3cols" style={{marginBottom: 32}}>
        <DataBox 
          title="Total Cash" 
          value={formatCurrency(totalBalance)} 
          icon={ICONS.bankaccounts} 
          color={COLORS.teal}
        />
        <DataBox 
          title="Escrow Held" 
          value={formatCurrency(totalEscrowHeld)} 
          icon={ICONS.escrow} 
          color={COLORS.statusWarning}
        />
        <DataBox 
          title="Pending Loan Capital" 
          value={formatCurrency(totalPendingLoans)} 
          icon={ICONS.loans} 
          color={COLORS.tealLight}
        />
      </div>

      {/* Gráfico y Actividad Grid */}
      <div className="grid">
        {/* Columna Principal: Gráfico de Cash Flow */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{ICONS.cashflow} Cash Flow & Projections</h2>
            <div className="seg">
              <button 
                className={`pill ${currentChartType === "cashflow" ? "active" : ""}`} 
                onClick={() => setCurrentChartType("cashflow")}
              >
                Cash Flow
              </button>
              <button 
                className={`pill ${currentChartType === "volume" ? "active" : ""}`} 
                onClick={() => setCurrentChartType("volume")}
              >
                Volume
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke={axisColor} tickLine={false} axisLine={{ stroke: axisColor }} />
              <YAxis 
                stroke={axisColor} 
                tickLine={false} 
                axisLine={{ stroke: axisColor }}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              
              {/* Línea Principal (Más gruesa y animada) */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS.teal} 
                strokeWidth={3} 
                dot={{ stroke: COLORS.teal, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Cash Flow"
                // Animación de entrada
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* Línea Secundaria/Target (Sutil y punteada) */}
              <Line 
                type="monotone" 
                dataKey="pv" 
                stroke={COLORS.tealLight} 
                strokeWidth={2} 
                dot={false}
                strokeDasharray="5 5"
                opacity={0.6}
                name="Target/Projection"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Columna Lateral: Acciones y Notificaciones */}
        <div className="sidebar" style={{ minWidth: 320, marginBottom: 60 }}>
          {/* Tarjeta de Acciones Pendientes */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: '1.2rem', color: COLORS.statusWarning }}>{ICONS.releaseAction} Pending Actions ({pendingActions.length})</h3>
            <div style={{ padding: '0 8px' }}>
              {pendingActions.map((action) => (
                <ActivityItem
                  key={action.id}
                  type={action.type}
                  title={action.title}
                  detail={action.detail}
                  actionIcon={ICONS.releaseAction}
                  onClick={() => alert(`Navigating to: ${action.title}`)}
                  statusColor={COLORS.statusWarning}
                />
              ))}
              {pendingActions.length === 0 && <div className="muted">No pending actions required.</div>}
            </div>
            <button className="btn" style={{ width: '100%', marginTop: 16 }}>View All Actions</button>
          </div>

          {/* Tarjeta de Notificaciones */}
          <div className="card">
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: '1.2rem' }}>🔔 Latest Activity</h3>
            <div style={{ padding: '0 8px' }}>
              {notifications.map((notif) => (
                <ActivityItem
                  key={notif.id}
                  type={notif.type}
                  title={notif.title}
                  detail={notif.detail}
                  time={notif.time}
                  onClick={() => alert(`Viewing: ${notif.title}`)}
                />
              ))}
            </div>
            <button className="btn" style={{ width: '100%', marginTop: 16 }}>View History</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const BottomMobileNav = ({ active, setActive, display, isVisible }) => {

  const navItems = [
    { id: 'dashboard', icon: ICONS.home, label: 'Home' },
    { id: 'bankaccounts', icon: ICONS.bankaccounts, label: 'Accounts' },
    { id: 'transfer', icon: ICONS.transfer, label: 'Transfer' , action: () => alert('Initiate Transfer') },
    { id: 'faq', icon: ICONS.faq, label: 'FAQ' },
    { id: 'user', icon: ICONS.user, label: 'User' },
  ];
  const visibilityClass = isVisible ? 'flex' : 'none'; 
  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActive(item.id);
    }
  };

  return (
    <div className="mobile-nav-bar" >
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          className="nav-item"
          onClick={() => handleNavClick(item)}
          whileTap={{ scale: 0.9 }}
          style={{
            color: active === item.id || (item.id === 'dashboard' && active === 'dashboard') ? COLORS.teal : 'var(--muted-color)',
            fontWeight: active === item.id ? 700 : 500,
            display: visibilityClass,
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
          <span className="tiny">{item.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// --- COMPONENTE CONTENEDOR DE VISTAS ---
const ActiveView = ({ active, theme, data }) => {
  const viewMap = {
    dashboard: <DashboardContent {...data} theme={theme} />,
    bankaccounts: <AccountsView accounts={data.bankAccounts} />,
    // Añade más vistas aquí
    cards: <CardsView cards={data.cards} />,
    loans: <LoansView loans={data.loans} />,
    escrow: <EscrowView escrows={data.escrows} releasePayments={data.releasePayments} />,
    trades: <TradesView trades={data.trades} />,
    factory: <ContractFactoryView factoryContracts={data.factoryContracts} />,
    advance: <AdvanceOffersView advancePaymentOffers={data.advancePaymentOffers} />,
  };

  return (
    <AnimatePresence mode="wait">
      {/* Key es crucial para que AnimatePresence detecte el cambio y aplique la transición */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {viewMap[active] || <div className="card" style={{ padding: 40 }}><h2 style={{ margin: 0 }}>View Not Found: {capitalize(active)}</h2></div>}
      </motion.div>
    </AnimatePresence>
  );
};
const calculateMenuVisibility = (isLoggedIn, activePage) => {
  // El menú es visible si:
  // 1. El usuario está loggeado (isLoggedIn === true)
  // 2. Y la página activa NO es la de 'login' (activePage !== 'login')
  return isLoggedIn && activePage !== 'login';
};

// --- COMPONENTE PRINCIPAL ---
export default function ClearoApp() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  const [animatingLogin, setAnimatingLogin] = useState(false);
  const [logoTrigger, setLogoTrigger] = useState(0);
  const [currentChartType, setCurrentChartType] = useState('cashflow');
  const [activeView, setActiveView] = useState('dashboard');

  const menuVisible = calculateMenuVisibility(loggedIn, active);

  const updateUI = () => {
    
        bottomNav.classList.remove('mobile-nav-bar-hidden');
        document.body.style.paddingBottom = '4rem'; 
};


  // --- DATA ---
  const data = {
    chartData: initialChartData,
    bankAccounts: initialBankAccounts,
    notifications: initialNotifications,
    pendingActions: initialPendingActions,
    escrows: initialEscrows,
    loans: initialLoans,
    cards: initialCards,
    trades: initialTrades,
    factoryContracts: initialFactoryContracts,
    advancePaymentOffers: initialAdvancePaymentOffers,
    releasePayments: initialReleasePayments,
    // Cálculos de métricas
    totalBalance: initialBankAccounts.reduce((sum, acc) => sum + (acc.currency === 'USD' ? acc.balance : 0), 0),
    totalEscrowHeld: initialEscrows.filter(e => e.status === 'Held').reduce((sum, e) => sum + e.amount, 0),
    totalPendingLoans: initialLoans.filter(l => l.status === 'Pending').reduce((sum, l) => sum + l.amount, 0),
    currentChartType: currentChartType,
    setCurrentChartType: setCurrentChartType,
  }

  // --- LÓGICA DE ESTADO Y HANDLERS ---
  const openSection = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignIn = () => {
    setAnimatingLogin(true);
    setTimeout(() => {
      setAnimatingLogin(false);
      setLoggedIn(true);
      setActive("dashboard");
    }, 900); // Transición más rápida y moderna
  };

  // Lógica de tema para variables de CSS
  const rootBg = theme === "dark" ? COLORS.deepBlue : COLORS.lightBg;
  const textColor = theme === "dark" ? COLORS.textLight : COLORS.textDark;
  const cardBg = theme === "dark" ? COLORS.cardDark : COLORS.cardLight;
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.08)" : COLORS.lightBorder;
  const textActiveColor = theme === "dark" ? COLORS.textLight : COLORS.deepBlue;


  const emailRef = useRef(null);

  useEffect(() => {
    if (!loggedIn && emailRef.current) {
      emailRef.current.focus();      
    }
  }, [loggedIn]);

  // --- EFECTO DE PARTÍCULAS (Canvas) - EL EFECTO GLOW/SUTIL ---
  useEffect(() => {
    const canvas = document.getElementById("particle-bg");
    
    if (!canvas) return; // Si no existe el canvas, salir

    // Solo en modo oscuro y si está logueado
    if (theme === "light" || !loggedIn) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5, // Partículas más pequeñas
      dx: (Math.random() - 0.5) * 0.3, // Movimiento más lento
      dy: (Math.random() - 0.5) * 0.3,
    }));

    let animationFrameId;

    function draw() {
      // Re-comprobación de tema
      if (theme === "light" || !loggedIn) {
        cancelAnimationFrame(animationFrameId);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Color sutil y ligeramente azulado en modo oscuro (el 'glow')
        ctx.fillStyle = "rgba(0, 122, 255, 0.15)";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        // Reinicio más suave de partículas
        if (p.x < 0 || p.x > w) p.x = p.x < 0 ? w : 0;
        if (p.y < 0 || p.y > h) p.y = p.y < 0 ? h : 0;
      });
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, loggedIn]); // Dependencia del estado de login y tema

  // --- COMPONENTE PRINCIPAL RENDER ---
  return (
    <div
      style={{
        background: rootBg,
        color: textColor,
        minHeight: "100vh",
        // Tipo de letra formal y moderno: 'Inter'
        fontFamily:
          "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Fondo de Partículas (Canvas) - Solo visible en Dark Mode y loggeado */}
      <canvas
        id="particle-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: theme === "dark" && loggedIn ? 0.08 : 0, // Opacidad más sutil
          transition: "opacity 0.8s ease",
        }}
      ></canvas>

      {/* --- ESTILOS OPTIMIZADOS (CSS-in-JS) --- */}
      <style>{`
        /* Variables de Tema Globales */
        :root {
          --deep: ${COLORS.deepBlue};
          --teal: ${COLORS.teal};
          --teal-alpha: ${theme === "dark" ? "rgba(0, 122, 255, 0.5)" : "rgba(0, 122, 255, 0.4)"};
          --teal-light-alpha: ${theme === "dark" ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 122, 255, 0.08)"};
          --teal-light-alpha-hover: ${theme === "dark" ? "rgba(0, 122, 255, 0.2)" : "rgba(0, 122, 255, 0.15)"};
          --card: ${cardBg};
          --border: ${borderColor};
          --text-color: ${textColor};
          --text-color-active: ${textActiveColor};
          --accent-warn: ${COLORS.statusWarning};
          --shadow: ${theme === "dark" ? "0 10px 40px rgba(0,0,0,0.6)" : "0 8px 30px rgba(17,24,39,0.06)"};
          --shadow-btn: ${theme === "dark" ? "0 4px 12px rgba(2,8,20,0.3)" : "0 4px 12px rgba(17,24,39,0.04)"};
          --hover-bg: ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; /* Más oscuro en dark/más claro en light */
          --hover-bg-subtle: ${theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}; /* Para elementos sutiles */
          --muted-color: ${theme === "dark" ? "rgba(255,255,255,0.65)" : "rgba(75,85,99,1)"};
        }
        * { box-sizing: border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        body, html, #root { margin:0; padding:0; height:100%; }

        /* Navbar Profesional y Superpuesto (Efecto Blur/Cristal) */
        .navbar {
          height: 72px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 10px 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: ${theme === "dark" ? "rgba(11, 17, 26, 0.95)" : "rgba(255, 255, 255, 0.95)"};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        
        /* --- Mobile Navigation Bar (Nuevo) --- */
        .mobile-nav-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 500;
            background-color: rgba(0, 0, 0, 0.7);
            border-top: 1px solid var(--border);
            padding: 8px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
        }
        .mobile-nav-bar-hidden{
            display: none;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 0;
            width: 20%;
            transition: color 0.2s;
        }

        /* Brand y Logo */
        .brand { display:flex; align-items:center; gap:12px; }
        .logo-pill {
          width:52px; height:52px; border-radius:14px;
          background: var(--deep);
          display:flex; align-items:center; justify-content:center;
          /* Sombra con efecto 'glow' */
          box-shadow: 0 10px 30px rgba(89, 93, 97, 0.35), inset 0 -8px 20px rgba(0,0,0,0.18);
          cursor:pointer;
          overflow:hidden;
          transition: transform .2s cubic-bezier(.2,.9,.3,1);
        }
        .logo-pill:hover { transform: scale(1.05); } /* Añadida animación de hover al logo */
        .logo-pill img { width: 68%; height:68%; object-fit:contain; user-drag: none; pointer-events:none; }
        .brand-title .title { font-weight:700; font-size:1.15rem; letter-spacing:0.2px; color: var(--text-color); }
        .brand-title .subtitle { font-size:0.8rem; color: var(--muted-color); margin-top:2px; font-weight:500; }
        .actions { display:flex; gap:10px; align-items:center; }

        /* Botones Mejorados */
        .btn {
          min-width:48px; padding: 10px 16px; border-radius:10px;
          border: 1px solid var(--border); background: var(--hover-bg-subtle);
          color: inherit; font-weight:600; cursor:pointer;
          box-shadow: var(--shadow-btn);
          transition: all .2s cubic-bezier(.2,.9,.3,1);
          outline: none;
        }
        .btn:hover {
          background: var(--hover-bg);
          transform: translateY(-1px);
        }
        .btn:active { transform: translateY(1px) scale(0.98); }
        .btn.cta {
          background: linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight});
          color: white; border: none;
          /* Sombra más llamativa para CTA (Glow Azul) */
          box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
        }

        /* Contenedor Principal (Mobile-First y Responsive) */
        .wrap { max-width: 1300px; margin: 0 auto; padding: 24px 20px; }
        @media(max-width: 600px) {
          .wrap { padding: 16px 12px; }
          .navbar { padding: 10px 16px; }
        }

        /* Estilos de Tarjeta (Caja) Optimizado */
        .card {
          background: var(--card);
          border-radius: 18px;
          padding: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        /* Grid para Desktop (Responsive) */
        .grid { display:grid; grid-template-columns: 1fr; gap: 24px; }
        .grid-3cols { grid-template-columns: 1fr; gap: 24px; }

        @media(min-width: 980px) {
          .grid {
            grid-template-columns: 2fr 1fr;
            gap:32px;
            align-items:start;
          }
          .grid-2cols {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .grid-3cols { 
            grid-template-columns: repeat(3, 1fr); 
            gap: 24px;
          }
          .sidebar {
            position: sticky;
            top: 96px;
            margin-bottom: 4rem;
          }
        }
        
        /* Tablas */
        .table-container { overflow-x: auto; }
        table { width:100%; border-collapse: separate; border-spacing: 0; font-size:0.95rem; min-width: 600px; }
        th, td { padding: 12px 10px; text-align:left; border-bottom: 1px solid var(--border); }
        thead th { color: var(--muted-color); font-weight:700; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px; }
        tbody tr:last-child td { border-bottom: none; }
        /* Animación de filas mejorada (el whileHover está en el componente) */
        
        /* Overlay (Menú) - Mejor Superposición y Efecto Blur */
        .overlay {
          position: fixed;
          left: 20px;
          top: 84px;
          width:340px;
          max-height: 80vh;
          overflow:auto;
          background: ${theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.96)"};
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          z-index: 101;
        }
        
        /* Corrección Móvil para Overlay */
        @media(max-width:720px){
          .overlay { left: 16px; right: 16px; width: auto; top: 82px; max-height: calc(100vh - 120px); }
          
        }
        
        /* Elementos del Menú (Framer Motion) */
        .menu-item {
          padding: 14px; border-radius: 14px; cursor:pointer; margin-bottom: 8px;
          transition: transform .2s cubic-bezier(.2,.9,.3,1), background .2s ease;
          display:flex; flex-direction:column; gap:6px;
        }

        /* Estilos de Formulario y Utilidad */
        .input {
          width:100%; padding:14px 16px; border-radius:12px; border: 1px solid var(--border);
          background: ${theme === "dark" ? "rgba(255,255,255,0.03)" : "#f9fafb"}; color: inherit;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .input:focus { border-color: var(--teal); outline:none; box-shadow: 0 0 0 3px ${theme === "dark" ? "rgba(0, 122, 255, 0.3)" : "rgba(0, 122, 255, 0.1)"}; }
        .seg { display:flex; gap:8px; }
        .pill {
          padding:8px 12px; border-radius:999px; font-weight:600;
          background: var(--hover-bg-subtle); border:1px solid var(--border);
          cursor:pointer; font-size:0.9rem; transition: background 0.2s ease, border-color 0.2s ease;
        }
        .pill:hover { background: var(--hover-bg); }
        .pill.active { background: var(--teal); color: white; border-color: var(--teal); }
        .muted { color: var(--muted-color); font-size:0.95rem; }
        .mini { font-size:0.88rem; color: var(--muted-color); }
        .tiny { font-size:0.78rem; color: var(--muted-color); }

        /* Botón de estado de tabla (Píldoras de Estado) */
        .status-pill {
            padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600;
            display: inline-block;
            white-space: nowrap;
        }
        /* Estados basados en la paleta profesional (fondo de baja opacidad) */
        .status-pill.active, .status-pill.funded, .status-pill.released {
          background-color: rgba(52, 199, 85, 0.15);
          color: ${COLORS.statusSuccess};
        }
        .status-pill.verified, .status-pill.negotiation {
          background-color: rgba(0, 122, 255, 0.15);
          color: ${COLORS.teal};
        }
        .status-pill.pending, .status-pill.awaitingapproval, .status-pill.pendingrelease, .status-pill.pendingdeposit, .status-pill.setup {
          background-color: rgba(255, 149, 0, 0.15);
          color: ${COLORS.statusWarning};
        }
        .status-pill.locked, .status-pill.draft {
          background-color: rgba(255, 59, 48, 0.15);
          color: ${COLORS.statusDanger};
        }
        .status-pill.held, .status-pill.complete {
          background-color: rgba(107, 114, 128, 0.15);
          color: #6b7280; /* Gris oscuro neutro */
        }
        
        /* Estilos para el Activity/Pending */
        .activity-item:last-child { border-bottom: none !important; }

      `}</style>

      {/* --- PANTALLA DE CARGA / INTRO --- */}
      <AnimatePresence>
        {animatingLogin && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: COLORS.teal,
              zIndex: 999998,
            }}
          >
            <motion.img
              src={logo}
              alt="Clearo"
              // Animación de rotación sofisticada
              initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 24,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVBAR (Superpuesto) --- */}
      <header className="navbar" role="banner">
        <div className="brand">
          {loggedIn && (
            <motion.button
              className="btn"
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              onClick={() => setMenuOpen((s) => !s)}
              title="Open menu"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              Menu {menuOpen ? "▲" : "▼"}
            </motion.button>
          )}

        </div>

        <div className="brand-title">
          

          <motion.button
            className="btn cta"
            onClick={() => {
              setActive("dashboard");
              setMenuOpen(false);
              updateUI();
              if (!loggedIn) handleSignIn();
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
          >
            {loggedIn ? "Dashboard" : "Sign In"}
          </motion.button>
        </div>
      </header>

      {/* --- OVERLAY DEL MENÚ --- */}
      <AnimatePresence>
        {loggedIn && menuOpen && (
          <motion.div
            className="overlay"
            id="main-menu"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="menu"
          >
            <h3 style={{ margin: "0 0 16px 0", color: COLORS.teal }}>Sections</h3>
            <MenuItem 
              id="dashboard" 
              active={active} 
              onClick={openSection} 
              label="Dashboard" 
              hint="Overview & Activity Feed" 
              icon={ICONS.dashboard} 
            />
            <MenuItem 
              id="bankaccounts" 
              active={active} 
              onClick={openSection} 
              label="Bank Accounts" 
              hint="Account Balances & Transfers" 
              icon={ICONS.bankaccounts} 
            />
            <MenuItem 
              id="cards" 
              active={active} 
              onClick={openSection} 
              label="Cards" 
              hint="Corporate Cards & Limits" 
              icon={ICONS.cards} 
            />
            <MenuItem 
              id="escrow" 
              active={active} 
              onClick={openSection} 
              label="Escrow" 
              hint="Held Funds & Releases" 
              icon={ICONS.escrow} 
            />
            <MenuItem 
              id="loans" 
              active={active} 
              onClick={openSection} 
              label="Loans & Credit" 
              hint="Financing and Borrowing" 
              icon={ICONS.loans} 
            />

            <hr style={{ margin: "16px 0", border: 'none', borderTop: '1px solid var(--border)' }} />

            <h3 style={{ margin: "0 0 16px 0", color: COLORS.accentSecondary }}>DeFi Ops</h3>
            <MenuItem 
              id="factory" 
              active={active} 
              onClick={openSection} 
              label="Contract Factory" 
              hint="Asset Securitization" 
              icon={ICONS.factory} 
            />
            <MenuItem 
              id="trades" 
              active={active} 
              onClick={openSection} 
              label="Asset Trades" 
              hint="DeFi Transactions" 
              icon={ICONS.trades} 
            />
            <MenuItem 
              id="advance" 
              active={active} 
              onClick={openSection} 
              label="Advance Pay" 
              hint="Early Settlement Discounts" 
              icon={ICONS.advance} 
            />

            <hr style={{ margin: "16px 0", border: 'none', borderTop: '1px solid var(--border)' }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="mini" style={{ color: "var(--muted-color)" }}>Theme:</div>
                <div className="seg">
                  <button className={`pill ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>Dark</button>
                  <button className={`pill ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>Light</button>
                </div>
              </div>
              <button 
                className="btn" 
                onClick={() => { setLoggedIn(false); setMenuOpen(false); setActive("login"); }}
                style={{ background: COLORS.statusDanger, color: 'white', border: 'none' }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="wrap" role="main">
        {!loggedIn ? (
          /* --- LOGIN VIEW --- */
          <motion.div
            style={{ maxWidth: 480, margin: "64px auto 120px auto" }}
            className="card"
            aria-live="polite"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 style={{ margin: 0, marginBottom: 8, fontWeight: 700 }}>Welcome to Clearo</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Securely manage bank accounts, escrow and finance operations.
            </p>

            <div style={{ marginTop: 24 }}>
              <input ref={emailRef} className="input" placeholder="Email or username" />
              <input className="input" placeholder="Password" type="password" style={{ marginTop: 14 }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                className="btn cta"
                onClick={handleSignIn}
                style={{ flex: 1, height: 48, fontSize: "1.1rem" }}
              >
                Sign In
              </button>

              <button
                className="btn"
                onClick={() => alert("Demo: password reset flow")}
                aria-label="Forgot password"
              >
                New
              </button>

              
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                className="btn"
                onClick={handleSignIn}
                style={{ flex: 1, height: 48, fontSize: "1.1rem" }}
              >
                Face ID
              </button>
              
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div className="tiny">Demo credentials: any email / password</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="mini" style={{ color: "var(--muted-color)" }}>Theme:</div>
                <div className="seg">
                  <button className={`pill ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>Dark</button>
                  <button className={`pill ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>Light</button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- APLICACIÓN PRINCIPAL (VISTAS ACTIVAS) --- */
          <ActiveView  active={active} theme={theme} data={data} />
        )}
      </main>
      <BottomMobileNav display={loggedIn} isVisible={menuVisible} active={active} setActive={setActiveView} />
    </div>
  );
}
