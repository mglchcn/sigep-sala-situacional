<template>
  <div class="editor-layout">
    <div class="editor-top">
      <h2>Gestor de Estrategia</h2>
      <div class="editor-actions">
        <button class="btn-secondary" @click="$emit('close')">Volver</button>
        <button class="btn-primary" @click="saveToCloud">
          <span class="material-icons-round">save</span> GUARDAR EN NUBE
        </button>
      </div>
    </div>

    <div class="editor-scroll">
      <div v-for="(pilar, pIdx) in store.data" :key="pIdx" class="edit-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="width:80%">
            <label>Título del Pilar</label>
            <input v-model="pilar.title" class="p-title" />
          </div>
        </div>
        
        <div v-for="(inter, iIdx) in pilar.interventions" :key="iIdx" class="edit-int-row">
          <div class="inp-row">
            <div><label>Nombre</label><input v-model="inter.name" /></div>
            <div><label>% Avance</label><input type="number" v-model.number="inter.indicator" min="0" max="100" /></div>
          </div>
          <div style="margin-top:10px">
            <label>Descripción</label>
            <input v-model="inter.desc" />
          </div>
        </div>
        
        <button class="btn-mini-add" @click="store.addIntervention(pIdx)">+ Añadir Intervención</button>
      </div>
      
      <button class="btn-add-pillar" @click="store.addPilar">+ NUEVO EJE ESTRATÉGICO</button>
    </div>
  </div>
</template>

<script setup>
import { useStrategyStore } from '../store/strategy';
const store = useStrategyStore();
const emit = defineEmits(['close']);

const saveToCloud = async () => {
  try {
    await store.saveData();
    alert("Datos sincronizados con éxito");
    emit('close');
  } catch (e) {
    alert("Error al guardar. Verifique la URL de configuración.");
  }
};
</script>
