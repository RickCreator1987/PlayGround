import { icon, cashLogo } from './icons.js';
import { avatar, brand, state } from './core.js';

export function sidebar(active) {
  const groups = [
    { label: 'Workspace', items: [['dashboard', 'Overview', 'home'], ['products', 'Products', 'box'], ['orders', 'Orders', 'receipt'], ['customers', 'Customers', 'users']] },
    { label: 'Money', items: [['payouts', 'Payouts', 'wallet'], ['analytics', 'Analytics', 'chart']] },
    { label: 'Developers', items: [['settings', 'Settings', 'settings']] },
  ];
  return `<aside class="sidebar" aria-label="Workspace navigation">
    <div class="sidebar-brand">${brand()}<button class="sidebar-collapse" type="button" data-action="toast" data-message="Sidebar stays open in this demo" aria-label="Collapse sidebar">${icon('arrow-left', 15)}</button></div>
    <button class="workspace" type="button" data-action="toast" data-message="Workspace switcher is not part of this demo">
      <span class="ws-avatar">C</span>
      <span class="ws-meta"><span class="ws-name">Cashly HQ</span><span class="ws-plan">Scale plan</span></span>
      ${icon('chevron-down', 13)}
    </button>
    ${groups.map((group) => `<div class="nav-group"><div class="nav-label">${group.label}</div>${group.items.map(([id, label, iconName]) => `
      <a class="side-link ${active === id ? 'active' : ''}" href="#/${id}">
        ${icon(iconName, 17)}<span>${label}</span>
        ${id === 'orders' ? `<span class="count">${state.orders.length}</span>` : ''}
      </a>`).join('')}</div>`).join('')}
    <div class="side-foot">
      <div class="connection"><span class="dot"></span><span class="conn-copy"><b>Cash App connected</b>$cashlyhq · instant payouts</span><a class="conn-link" href="#/settings" aria-label="Cash App settings">${icon('chevron-right', 13)}</a></div>
      <button class="user-card" type="button" data-action="toast" data-message="Account menu is not part of this demo">
        ${avatar('Miles Carter')}
        <span><span class="uc-name">Miles Carter</span><span class="uc-mail">miles@cashly.demo</span></span>
        ${icon('more', 15)}
      </button>
    </div>
  </aside>`;
}

export function topbar() {
  return `<header class="topbar">
    <div class="topbar-left">
      <button class="icon-btn mobile-menu" type="button" data-action="toggle-nav" aria-label="Open navigation">${icon('menu', 18)}</button>
      <span class="crumb">Cashly HQ ${icon('chevron-right', 11)} <b>Workspace</b></span>
    </div>
    <div class="topbar-actions">
      <label class="topbar-search">${icon('search', 15)}<input id="global-search" type="search" placeholder="Search orders, products…" aria-label="Search" autocomplete="off"><span class="kbd">⌘K</span></label>
      <button class="icon-btn" type="button" data-action="toast" data-message="No new notifications" aria-label="Notifications">${icon('bell', 17)}<span class="dot"></span></button>
      <button class="user-chip" type="button" data-action="toast" data-message="Account menu is not part of this demo">${avatar('Miles Carter')}<span>Miles Carter</span>${icon('chevron-down', 12)}</button>
    </div>
  </header>`;
}

export function dashboardShell(active, content) {
  return `<div class="shell">
    ${sidebar(active)}
    <div class="nav-scrim" data-action="close-nav"></div>
    <div class="main">
      ${topbar()}
      <main class="page" id="main">${content}</main>
    </div>
  </div>`;
}

export function pageHead(title, sub, actions = '') {
  return `<div class="page-head"><div><h1 class="page-title">${title}</h1><p class="page-sub">${sub}</p></div><div class="head-actions">${actions}</div></div>`;
}
