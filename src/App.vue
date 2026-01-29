<template>
  <div class="app-layout">
    <header class="navbar">
      <div class="brand">
        <div class="logo"><span class="material-icons-round">account_balance</span></div>
        <div class="titles">
          <h1>PRESIDENCIA</h1>
          <h2>TABLERO DE CONTROL GUBERNAMENTAL</h2>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-box">
          <span class="label">EJECUCIÓN GLOBAL</span>
          <span class="value">{{ store.globalKpi }}%</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="label">ALERTAS</span>
          <span class="value danger">{{ store.alerts }}</span>
        </div>
      </div>
      </header>

    <main class="content-area">
      <div v-if="currentView === 'dashboard'" class="cards-grid">
        <PillarCard v-for="(p, idx) in store.data" :key="idx" :pillar="p" />
      </div>
      <StrategyEditor v-else />
    </main>
  </div>
</template>

<script setup>
import { useStrategyStore } from './store/strategy';
const store = useStrategyStore();
// Lógica de cambio de vista similar a app.toggleView
</script>