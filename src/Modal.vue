<script setup>
import { defineEmits } from 'vue';

// Define the emits function to allow the modal to communicate with the parent component
const emit = defineEmits(['close']);

function close() {
  emit('close');
}

defineProps({
  showChoose: {
    type: Boolean,
    default: true
  },
  showUnChoose: {
    type: Boolean,
    default: false
  }
});
</script>
<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <button class="close-button" @click="close">X</button>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  position: relative;
  width: 50%;
  max-width: 500px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 101;
}

.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: white;
  color:black;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 102;
}

input[type=button] {
  margin-right: 5px;
}
</style>
