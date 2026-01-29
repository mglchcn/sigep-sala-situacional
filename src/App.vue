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
        <button class="btn-hero" @click="store.toggleCarousel()">
           <span class="material-icons-round">{{ store.isCarousel ? 'stop' : 'play_arrow' }}</span>
           {{ store.isCarousel ? 'DETENER' : 'PRESENTACIÓN' }}
        </button>
        <button class="btn-icon" @click="showConfig = !showConfig">
          <span class="material-icons-round">settings</span>
        </button>
        <button class="btn-icon" @click="currentView = 'editor'" v-if="!store.isCarousel">
          <span class="material-icons-round">edit</span>
        </button>
      </div>
    </header>

    <div class="time-bar" :class="{ 'animating': store.isCarousel }"></div>

    <main class="content-area" :class="{ 'carousel-mode': store.isCarousel }">
      <div v-if="currentView === 'dashboard'" class="cards-grid">
        <PillarCard 
          v-for="(p, idx) in store.data" 
          :key="idx" 
          :pillar="p"
          :class="{ 'active-slide': store.isCarousel && store.currentSlide === idx }" 
        />
      </div>

      <StrategyEditor v-else @close="currentView = 'dashboard'" />
      
      <div v-if="store.isCarousel" class="nav-dots">
         <div v-for="(_, idx) in store.data" :key="idx" 
              class="dot" 
              :class="{ active: store.currentSlide === idx }"
              @click="store.currentSlide = idx"></div>
      </div>
    </main>
    
    <div v-if="showConfig" class="modal-backdrop">
       <div class="modal-window">
          <h3>Conexión Nube</h3>
          <p style="font-size:0.8rem; color:#aaa; margin-bottom:10px">Ingrese la URL del Web App Script (Google) o API:</p>
          <input v-model="configUrl" placeholder="https://script.google.com/..." />
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
             <button class="btn-secondary" @click="showConfig = false">Cerrar</button>
             <button class="btn-primary" @click="saveConfig">Guardar</button>
          </div>
       </div>
    </div>

    <div v-if="store.loading" class="loading-overlay"><div class="spinner"></div></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStrategyStore } from './store/strategy';
import PillarCard from './components/PillarCard.vue';
import StrategyEditor from './components/StrategyEditor.vue';

const store = useStrategyStore();
const currentView = ref('dashboard');
const showConfig = ref(false);
const configUrl = ref(localStorage.getItem('cengob_url') || '');

const saveConfig = () => {
  localStorage.setItem('cengob_url', configUrl.value);
  store.fetchStrategy();
  showConfig.value = false;
};

onMounted(() => {
  store.fetchStrategy();
});
</script>

<style>
/* Estilos extra para la lógica de Vue que no estaban en CSS puro */
.time-bar.animating { width: 100%; transition: width 10s linear; }
.time-bar { width: 0%; height: 4px; background: var(--accent); transition: none; }
.nav-dots .dot { width: 12px; height: 12px; border-radius: 50%; background: #555; cursor: pointer; transition: 0.3s; }
.nav-dots .dot.active { background: var(--accent); transform: scale(1.3); }
</style>
