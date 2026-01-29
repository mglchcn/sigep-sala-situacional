import { defineStore } from 'pinia';
import axios from 'axios';

// Datos de ejemplo para que la app no inicie vacía
const DEFAULT_DATA = [
    {
        title: "Industrialización",
        icon: "factory",
        interventions: [
            {
                name: "Complejo Siderúrgico del Mutún",
                desc: "Sustitución de importaciones de acero.",
                indicator: 85,
                indResultado: "Reducción 50% import.",
                indProducto: "Planta Fase 1",
                milestones: [{date: "15 Oct", desc: "Encendido reactor"}],
                tasks: [{name: "Gestión de Gasoducto", ministry: "YPFB"}, {name: "Licencia Ambiental", ministry: "Min. Medio Ambiente"}]
            }
        ]
    }
];

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    data: [],
    loading: false,
    isCarousel: false,
    currentSlide: 0,
    carouselInterval: null,
    timeBarWidth: 0, // Nuevo estado para controlar la animación
    globalKpi: 0,
    alerts: 0
  }),
  actions: {
    async fetchStrategy() {
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      this.loading = true;
      if (!url) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.calculateGlobalStats();
        this.loading = false;
        return;
      }
      try {
        const res = await axios.get(url);
        this.data = res.data.data || res.data;
        this.calculateGlobalStats();
      } catch (e) {
        console.error("Usando datos locales por error de conexión");
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.calculateGlobalStats();
      } finally {
        this.loading = false;
      }
    },
    async saveData() {
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      if (!url) return alert("Configure la URL de la nube primero.");
      try {
        await axios.post(url, this.data);
        this.calculateGlobalStats();
      } catch (e) {
        alert("Error al guardar en la nube");
      }
    },
    calculateGlobalStats() {
      let sum = 0, count = 0, alerts = 0;
      if (this.data) {
          this.data.forEach(p => {
            if(p.interventions) p.interventions.forEach(i => {
                let v = parseFloat(i.indicator) || 0;
                sum += v; count++;
                if (v < 50) alerts++;
            });
          });
      }
      this.globalKpi = count > 0 ? Math.round(sum / count) : 0;
      this.alerts = alerts;
    },
    // --- GESTIÓN DE ELEMENTOS ---
    addPilar() { this.data.push({ title: "Nuevo Eje", icon: "flag", interventions: [] }); },
    deletePilar(idx) { if(confirm('¿Borrar Eje?')) this.data.splice(idx, 1); },
    addIntervention(pIdx) { 
        if(!this.data[pIdx].interventions) this.data[pIdx].interventions = [];
        this.data[pIdx].interventions.push({ name: "Nueva", indicator: 0, milestones: [], tasks: [] }); 
    },
    deleteIntervention(pIdx, iIdx) { this.data[pIdx].interventions.splice(iIdx, 1); },
    // --- GESTIÓN DE SUB-ITEMS ---
    addMilestone(pIdx, iIdx) { 
        if(!this.data[pIdx].interventions[iIdx].milestones) this.data[pIdx].interventions[iIdx].milestones = [];
        this.data[pIdx].interventions[iIdx].milestones.push({date: "", desc: ""}); 
    },
    removeMilestone(pIdx, iIdx, mIdx) { this.data[pIdx].interventions[iIdx].milestones.splice(mIdx, 1); },
    addTask(pIdx, iIdx) { 
        if(!this.data[pIdx].interventions[iIdx].tasks) this.data[pIdx].interventions[iIdx].tasks = [];
        this.data[pIdx].interventions[iIdx].tasks.push({name: "", ministry: ""}); 
    },
    removeTask(pIdx, iIdx, tIdx) { this.data[pIdx].interventions[iIdx].tasks.splice(tIdx, 1); },
    
    // --- LÓGICA DE CARRUSEL Y PANTALLA COMPLETA ---
    toggleCarousel() {
        this.isCarousel = !this.isCarousel;
        if (this.isCarousel) {
            this.currentSlide = 0;
            // Activa pantalla completa
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
            this.startLoop();
        } else {
            this.stopLoop();
            this.timeBarWidth = 0;
            // Sale de pantalla completa
            if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
        }
    },
    startLoop() {
        this.stopLoop();
        this.timeBarWidth = 0; // Reinicia la barra
        setTimeout(() => { this.timeBarWidth = 100; }, 50); // Inicia la animación

        this.carouselInterval = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.data.length;
            this.timeBarWidth = 0; // Reinicia para el siguiente slide
            setTimeout(() => { this.timeBarWidth = 100; }, 50);
        }, 10000); // 10 segundos por slide
    },
    stopLoop() {
        if (this.carouselInterval) clearInterval(this.carouselInterval);
    }
  }
});
