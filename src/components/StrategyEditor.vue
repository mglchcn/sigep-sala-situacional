<template>
  <div class="editor-layout">
    <div class="editor-top">
      <h2>Gestor de Estrategia</h2>
      <div class="editor-actions">
        <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
        <button class="btn-primary" @click="saveToCloud">
          <span class="material-icons-round">save</span> GUARDAR EN NUBE
        </button>
      </div>
    </div>

    <div class="editor-scroll">
      <div v-for="(pilar, pIdx) in store.data" :key="pIdx" class="edit-card">
        <div class="inp-row">
          <label>Título del Pilar</label>
          <input v-model="pilar.title" class="p-title" />
        </div>
        
        <div v-for="(inter, iIdx) in pilar.interventions" :key="iIdx" class="edit-int-row">
          <div class="inp-row">
            <div><label>Nombre</label><input v-model="inter.name" /></div>
            <div><label>% Avance</label><input type="number" v-model="inter.indicator" /></div>
          </div>
          </div>
        <button class="btn-mini-add" @click="store.addIntervention(pIdx)">+ Añadir Intervención</button>
      </div>
    </div>
    <button class="btn-add-pillar" @click="store.addPilar">+ NUEVO EJE ESTRATÉGICO</button>
  </div>
</template>

<script setup>
import { useStrategyStore } from '../store/strategy';
const store = useStrategyStore();

const saveToCloud = async () => {
  await store.saveData();
  alert("Sincronizado con la nube");
};
</script>