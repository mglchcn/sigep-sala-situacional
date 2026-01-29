<template>
  <div class="pillar-card">
    <div class="card-header">
      <div class="header-info">
        <span class="material-icons-round header-icon">{{ pillar.icon }}</span>
        <div class="header-text"><h3>{{ pillar.title }}</h3></div>
      </div>
      <div class="header-gauge">
        <div class="gauge-val">{{ average }}%</div>
      </div>
    </div>
    <div class="card-body">
      <InterventionCard 
        v-for="(int, idx) in pillar.interventions" 
        :key="idx" 
        :intervention="int" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InterventionCard from './Intervention.vue';

const props = defineProps(['pillar']);
const average = computed(() => {
  const ints = props.pillar.interventions;
  if (!ints.length) return 0;
  return Math.round(ints.reduce((a, b) => a + (parseFloat(b.indicator) || 0), 0) / ints.length);
});

</script>
