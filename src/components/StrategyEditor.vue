<template>
  <div class="editor-layout">
    <div class="editor-top">
      <h2>Gestor de Estrategia</h2>
      <div class="editor-actions">
        <button class="btn-secondary" @click="$emit('close')">Volver</button>
        <button class="btn-primary" @click="saveAndClose">
          <span class="material-icons-round">save</span> GUARDAR
        </button>
      </div>
    </div>

    <div class="editor-scroll">
      <div v-for="(pilar, pIdx) in store.data" :key="pIdx" class="edit-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <div style="width:80%">
            <label>TÍTULO DEL EJE ESTRATÉGICO</label>
            <input v-model="pilar.title" class="p-title" style="font-weight:bold; font-size:1.1rem;" />
          </div>
          <button class="btn-danger-icon" @click="store.deletePilar(pIdx)">delete_forever</button>
        </div>
        
        <div v-for="(inter, iIdx) in pilar.interventions" :key="iIdx" class="edit-int-row">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
             <strong>{{ inter.name || 'Nueva Intervención' }}</strong>
             <button class="btn-danger-icon" @click="store.deleteIntervention(pIdx, iIdx)">delete</button>
          </div>

          <div class="inp-row">
            <div><label>Nombre</label><input v-model="inter.name" /></div>
            <div><label>% Avance</label><input type="number" v-model.number="inter.indicator" /></div>
          </div>
          <div style="margin-bottom:10px"><label>Descripción</label><input v-model="inter.desc" /></div>
          <div class="inp-row">
            <div><label>Ind. Resultado</label><input v-model="inter.indResultado" /></div>
            <div><label>Ind. Producto</label><input v-model="inter.indProducto" /></div>
          </div>

          <div class="inp-row">
            <div class="sub-editor-box">
               <label>HITOS CLAVE</label>
               <div v-for="(m, mIdx) in inter.milestones" :key="mIdx" style="display:flex; gap:5px; margin-bottom:5px;">
                  <input v-model="m.date" placeholder="Fecha" style="width:30%" />
                  <input v-model="m.desc" placeholder="Descripción" />
                  <button @click="store.removeMilestone(pIdx, iIdx, mIdx)" style="color:red;border:none;background:none;cursor:pointer;">×</button>
               </div>
               <button class="btn-mini-add" @click="store.addMilestone(pIdx, iIdx)">+ Hito</button>
            </div>

            <div class="sub-editor-box">
               <label>TAREAS Y RESPONSABLES</label>
               <div v-for="(t, tIdx) in inter.tasks" :key="tIdx" style="display:flex; gap:5px; margin-bottom:5px;">
                  <input v-model="t.name" placeholder="Tarea" />
                  <input v-model="t.ministry" placeholder="Ministerio" style="width:35%" />
                  <button @click="store.removeTask(pIdx, iIdx, tIdx)" style="color:red;border:none;background:none;cursor:pointer;">×</button>
               </div>
               <button class="btn-mini-add" @click="store.addTask(pIdx, iIdx)">+ Tarea</button>
            </div>
          </div>
        </div>
        
        <button @click="store.addIntervention(pIdx)" style="width:100%; padding:10px; margin-top:15px; border:1px dashed #ccc; background:none; cursor:pointer;">+ Añadir Intervención</button>
      </div>
      
      <button class="btn-add-pillar" @click="store.addPilar">+ NUEVO EJE ESTRATÉGICO</button>
    </div>
  </div>
</template>

<script setup>
import { useStrategyStore } from '../store/strategy';
const store = useStrategyStore();
const emit = defineEmits(['close']);

const saveAndClose = async () => {
  await store.saveData();
  emit('close');
};
</script>
