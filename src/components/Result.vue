<script setup>
import {ref, inject, defineEmits, computed} from 'vue';
import Modal from "@/Modal.vue";

const globalData = inject('globalData');

const emit = defineEmits(['chosen', 'discarded', 'opened', 'cleared']);

const expanded = ref(false);
const selectedOption = ref(null);

const props = defineProps({
  title: {type: String, required: true},
  text: {type: String, required: true},
  mode: {type: String, required: true},
  index: {type: Number, required: true},
  currently_chosen: {type: Boolean, default: false},
  currently_discarded: {type: Boolean, default: false}
})

const currently_chosen = computed(() => props.currently_chosen);
const currently_discarded = computed(() => props.currently_discarded);

async function toggleModal() {
  if (props.mode === 'rate') return
  expanded.value = !expanded.value;
  if (expanded.value) {
    selectedOption.value = currently_chosen.value ? 'choose' : (currently_discarded.value ? 'discard' : null);
  }
  await globalData.log_data({
    log: 'expand_result',
    title: props.title,
    text: props.text,
    'expanded': expanded.value,
    'index': props.index
  })
  emit('opened', props.index)
}

async function handleSelection() {
  if (selectedOption.value === 'choose') {
    await globalData.log_data({log: 'choose_result', title: props.title, text: props.text, index: props.index})
    emit('chosen', props.index)
  } else if (selectedOption.value === 'discard') {
    await globalData.log_data({log: 'discard_result', title: props.title, text: props.text, index: props.index})
    emit('discarded', props.index)
  }
  else if (selectedOption.value === 'noAction'){
    if(currently_chosen.value){
      await globalData.log_data({log: 'unchoose_result', title: props.title, text: props.text, index: props.index})
    }
    else if(currently_discarded.value){
      await globalData.log_data({log: 'undiscard_result', title: props.title, text: props.text, index: props.index})
    }
    emit('cleared', props.index)
  }
  await closeModal();
}

async function closeModal() {
  selectedOption.value = null;
  expanded.value = false;
  await globalData.log_data({
    log: 'expand_result',
    title: props.title,
    text: props.text,
    'expanded': false,
    'index': props.index
  })
}
</script>

<template>
  <div
      :class="{'search-result':true, 'chosen': currently_chosen, 'discarded': currently_discarded, 'search-result-clickable': props.mode !== 'rate'}">
    <h3 :class="{'result-title': mode !== 'rate'}" @click="toggleModal" v-html="props.title"></h3>
    <p class="result-snippet" @click="toggleModal" v-if="props.text.split(' ').length > 20 && mode !== 'rate'">
      {{ props.text.split(' ').slice(0, 20).join(' ') + '...' }}</p>
    <p class="result-snippet" @click="toggleModal" v-else>{{ props.text }}</p>
    <Modal v-if="expanded" :showChoose="mode==='choose'" @close="closeModal">
      <p>{{ props.text }}</p>
      <div v-if="mode === 'choose'" class="radio-group">
        <div class="radio-option">
          <input type="radio" id="choose" v-model="selectedOption" value="choose" @change="handleSelection">
          <label for="choose">Choose</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="discard" v-model="selectedOption" value="discard" @change="handleSelection">
          <label for="discard">Discard</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="noAction" v-model="selectedOption" value="noAction" @change="handleSelection">
          <label for="noAction">Close - No action</label>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.search-result {
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
}

.search-result-clickable {
  cursor: pointer;
}

.result-title {
  text-decoration: underline;
  color: #1a0dab;
  font-size: 18px;
  margin-bottom: 5px;
}

.chosen {
  background-color: #c3f8b0;
}

.discarded {
  background-color: #ffcccb;
}

.result-snippet {
  color: #545454;
  font-size: 14px;
  margin-bottom: 5px;
}

.radio-group {
  margin-bottom: 10px;
}

.radio-option {
  position: relative;
  margin-bottom: 10px;
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-option label {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
}

.radio-option label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background-color: #fff;
}

.radio-option input[type="radio"]:checked + label:after {
  content: '';
  position: absolute;
  left: 5px; /* Adjusted for centering */
  top: 5px; /* Adjusted for centering */
  width: 10px; /* Adjusted size */
  height: 10px; /* Adjusted size */
  border-radius: 50%;
  background-color: #2196F3;
}

.radio-option:hover input[type="radio"] ~ label:before {
  background-color: #f1f1f1;
}

.radio-option input[type="radio"]:focus + label:before {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}
</style>