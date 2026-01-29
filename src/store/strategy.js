import { defineStore } from 'pinia';
import axios from 'axios';

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    data: [],
    isCarousel: false,
    globalKpi: 0,
    alerts: 0,
    loading: false
  }),
  actions: {
    async fetchStrategy() {
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      if (!url) return;
      this.loading = true;
      try {
        const res = await axios.get(url);
        // Ajuste según la estructura de respuesta de Google Apps Script o API
        this.data = res.data.data || res.data; 
        this.calculateGlobalStats();
      } catch (e) {
        console.error("Error cargando datos de la nube", e);
      } finally {
        this.loading = false;
      }
    },
    async saveData() {
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      if (!url) return;
      try {
        await axios.post(url, this.data);
        this.calculateGlobalStats();
      } catch (e) {
        console.error("Error al guardar", e);
        throw e;
      }
    },
    calculateGlobalStats() {
      let sum = 0, count = 0, alerts = 0;
      this.data.forEach(p => p.interventions.forEach(i => {
        let v = parseFloat(i.indicator) || 0;
        sum += v; count++;
        if (v < 50) alerts++;
      }));
      this.globalKpi = count > 0 ? Math.round(sum / count) : 0;
      this.alerts = alerts;
    },
    addPilar() {
      this.data.push({
        title: "Nuevo Eje Estratégico",
        icon: "flag",
        interventions: []
      });
    },
    addIntervention(pIdx) {
      this.data[pIdx].interventions.push({
        name: "Nueva Intervención",
        desc: "",
        indicator: 0,
        milestones: [],
        tasks: []
      });
    }
  }
});
