<template>
  <div class="int-card">
    <div class="int-chart">
      <canvas ref="chartCanvas"></canvas>
      <div class="int-chart-val">{{ intervention.indicator }}%</div>
    </div>
    <div class="int-content">
      <h4>{{ intervention.name }}</h4>
      <p>{{ intervention.desc }}</p>
      
      <div class="tags">
        <span v-if="intervention.indResultado" class="tag res">RES: {{ intervention.indResultado }}</span>
        <span v-if="intervention.indProducto" class="tag prod">PROD: {{ intervention.indProducto }}</span>
      </div>
      
      <div class="details-grid">
        <div>
          <div class="sec-title">Próximos Hitos</div>
          <div class="ms-list">
            <div v-for="(m, i) in intervention.milestones" :key="i" class="ms-item">
              <span class="ms-date">{{ m.date }}</span>
              <span class="ms-desc">{{ m.desc }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="sec-title">Tareas Críticas</div>
          <div class="task-list">
            <div v-for="(t, i) in intervention.tasks" :key="i" class="task-item">
              <span class="task-name">{{ t.name }}</span>
              <span class="ministry-badge">{{ t.ministry }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps(['intervention']);
const chartCanvas = ref(null);

onMounted(() => {
  // Recreamos la lógica de creación de gauges del script original
  new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [props.intervention.indicator, 100 - props.intervention.indicator],
        backgroundColor: [props.intervention.indicator < 50 ? '#ef4444' : '#3b82f6', 'rgba(255,255,255,0.05)'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { tooltip: { enabled: false } } }
  });
});
</script>