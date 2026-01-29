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
      <div class="controls">
        <button class="btn-icon" @click="currentView = 'dashboard'" title="Dashboard">
          <span class="material-icons-round">dashboard</span>
        </button>
        <button class="btn-icon" @click="currentView = 'editor'" title="Editar">
          <span class="material-icons-round">edit</span>
        </button>
      </div>
    </header>

    <main class="content-area">
      <div v-if="currentView === 'dashboard'" class="cards-grid">
        <PillarCard v-for="(p, idx) in store.data" :key="idx" :pillar="p" />
      </div>
      <StrategyEditor v-else @close="currentView = 'dashboard'" />
    </main>
    
    <div v-if="store.loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStrategyStore } from './store/strategy';
import PillarCard from './components/PillarCard.vue';
import StrategyEditor from './components/StrategyEditor.vue';

const store = useStrategyStore();
const currentView = ref('dashboard');

onMounted(() => {
  store.fetchStrategy();
});
</script>
