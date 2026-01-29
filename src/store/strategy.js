import { defineStore } from 'pinia';
import axios from 'axios';

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    data: [], // Aquí se cargarán los Pilares e Intervenciones
    isCarousel: false,
    globalKpi: 0,
    alerts: 0
  }),
  actions: {
    async fetchStrategy() {
      // En la nube, apuntamos a la URL configurada en el modal
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      if (url) {
        try {
          const res = await axios.get(url);
          this.data = res.data.data;
          this.calculateGlobalStats();
        } catch (e) {
          console.error("Error cargando datos de la nube");
        }
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
    }
  }
});