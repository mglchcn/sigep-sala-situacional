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
                milestones: [
                    {date: "15 Oct", desc: "Encendido reactor"}
                ],
                tasks: [
                    {name: "Gestión de Gasoducto", ministry: "YPFB"},
                    {name: "Licencia Ambiental", ministry: "Min. Medio Ambiente"}
                ]
            }
        ]
    }
];

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    data: [], // Inicia vacío, pero se llenará en fetchStrategy
    isCarousel: false,
    globalKpi: 0,
    alerts: 0,
    loading: false
  }),
  actions: {
    async fetchStrategy() {
      // Intentar obtener URL de entorno o localStorage
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      
      this.loading = true;
      
      if (!url) {
        // FALLBACK: Si no hay URL, cargamos los datos por defecto
        console.warn("No hay URL configurada. Cargando datos de demostración.");
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.calculateGlobalStats();
        this.loading = false;
        return;
      }

      try {
        const res = await axios.get(url);
        // Soporte para respuestas directas o envueltas en { data: ... }
        this.data = res.data.data || res.data; 
        this.calculateGlobalStats();
      } catch (e) {
        console.error("Error cargando datos de la nube, usando demo", e);
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.calculateGlobalStats();
      } finally {
        this.loading = false;
      }
    },
    async saveData() {
      const url = import.meta.env.VITE_API_URL || localStorage.getItem('cengob_url');
      if (!url) {
        alert("Modo Demo: No se puede guardar en la nube sin configurar VITE_API_URL o localStorage 'cengob_url'.");
        return;
      }
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
      if (this.data && this.data.length > 0) {
          this.data.forEach(p => {
            if(p.interventions) {
                p.interventions.forEach(i => {
                    let v = parseFloat(i.indicator) || 0;
                    sum += v; count++;
                    if (v < 50) alerts++;
                });
            }
          });
      }
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
      if (!this.data[pIdx].interventions) this.data[pIdx].interventions = [];
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
