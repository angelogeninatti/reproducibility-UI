<script setup>
import {computed, inject, onMounted, ref} from 'vue';
import ExperimentModule from "@/components/ExperimentModule.vue";
import ConsentForm from "@/components/ConsentForm.vue";
import axios from "axios";
import Instructions from "@/components/Instructions.vue";
const globalData = inject('globalData');
globalData.log_data({log: 'next_page', phase: 0});
const page = ref(0);
const previously_extracted = ref([]);
function nextPage(){
  window.scrollTo(0, 0);
  page.value++;
  globalData.current_scene.value++;
  globalData.log_data({log: 'next_page', phase: page.value});
  if(page.value >= globalData.NUM_PAGES)
    globalData.log_data({log: 'end_experiment'})
}

async function updateExtracted(chosen, preload=true) {
  previously_extracted.value.push(chosen)
  // If appropriate, pre-load the next query
  if (preload && page.value < globalData.NUM_PAGES - 2) {
    await globalData.load_next_query(previously_extracted, null)
  }
}

function stopexperiment(){
  page.value = 100;
}

async function submitResults(){
  location.href = "https://app.prolific.com/submissions/complete?cc=CQZ2NMKY"
}

const isProlific = computed(() => new URLSearchParams(window.location.search).has('prolificID'));

let uuid = ref('')
window.setTimeout(() => {
  uuid.value = sessionStorage.getItem("uuid")
}, 1000)

onMounted(async () => {
  await globalData.load_next_query(previously_extracted, null) // Pre-load the first query for smoother UX
})

// Compute the progress percentage
const progressPercentage = computed(() => {
  return (globalData.current_scene.value / (globalData.TOTAL_NUM_SCENES - 1)) * 100;
});
</script>

<template>
  <div class="wrapper">
    <p id="id">ID: {{uuid}}</p>
    <div class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      <div class="progress-bar-left" :style="{ width: (100 - progressPercentage) + '%' }"></div>
    </div>
    <p v-if="page===0">This experiment aims to test the performance of different algorithms for retrieving results in a search engine for a given query.
      We will ask you to choose relevant results for the provided queries while giving you instructions on how to interact with the system on the spot.<br>
      You may take this study only once.
      <br><br>
      <button @click="nextPage" :disabled="!uuid" :title="uuid ? '' : 'Loading the experiment, just a moment...'">Next</button>
    </p>
    <ConsentForm v-if="page===1" @nextpage="nextPage"/>
    <p v-else-if="page===2">
      <Instructions :collapsed="false"/>
      <button @click="nextPage">Begin</button>
    </p>
    <ExperimentModule v-else-if="page===3" :step="'Step ' + (page - 1).toString()" :already_chosen="previously_extracted" @nextpage="nextPage" @chosen="updateExtracted" @stopexperiment="stopexperiment" :batch_size="globalData.assigned_exp_condition['batch_size']" :b="globalData.assigned_exp_condition['b']" :k1="globalData.assigned_exp_condition['k1']"></ExperimentModule>
    <ExperimentModule v-else-if="page===4" :step="'Step ' + (page - 1).toString()" :already_chosen="previously_extracted" @nextpage="nextPage" @chosen="updateExtracted" @stopexperiment="stopexperiment" :batch_size="globalData.assigned_exp_condition['batch_size']" :b="globalData.assigned_exp_condition['b']" :k1="globalData.assigned_exp_condition['k1']"></ExperimentModule>
    <ExperimentModule v-else-if="page===5" :step="'Step ' + (page - 1).toString()" :already_chosen="previously_extracted" @nextpage="nextPage" @chosen="updateExtracted" @stopexperiment="stopexperiment" :batch_size="globalData.assigned_exp_condition['batch_size']" :b="globalData.assigned_exp_condition['b']" :k1="globalData.assigned_exp_condition['k1']"></ExperimentModule>
    <ExperimentModule v-else-if="page===6" :step="'Step ' + (page - 1).toString()" :already_chosen="previously_extracted" @nextpage="nextPage" @chosen="updateExtracted" @stopexperiment="stopexperiment" :batch_size="globalData.assigned_exp_condition['batch_size']" :b="globalData.assigned_exp_condition['b']" :k1="globalData.assigned_exp_condition['k1']"></ExperimentModule>
    <ExperimentModule v-else-if="page===7" :step="'Step ' + (page - 1).toString()" :already_chosen="previously_extracted" @nextpage="nextPage" @chosen="updateExtracted" @stopexperiment="stopexperiment" :batch_size="globalData.assigned_exp_condition['batch_size']" :b="globalData.assigned_exp_condition['b']" :k1="globalData.assigned_exp_condition['k1']"></ExperimentModule>
    <p v-else-if="page===8">
      The experiment is now finished. Thank you for your help!
      <p v-if="isProlific">
        <b>IMPORTANT:</b> please click on the button below to submit your results. If you don't submit your results, we will not be able to pay you.<br>
        <button @click="submitResults">Submit</button>
      </p>
    </p>
  </div>
</template>

<style scoped>
#id{
  position:absolute;
  right:20px;
  top: 0;
  z-index:100;
}
.progress-bar-wrapper {
  width: 100%;
  position:absolute;
  top:0;
  left: 0;
  background-color: #e0e0e0;
  border-radius: 5px;
  height: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #76c7c0;
  border-radius: 5px 0 0 5px;
  transition: width 0.3s ease;
  left: 0;
  top: 0;
}

.progress-bar-left {
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 0 5px 5px 0;
  transition: width 0.3s ease;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
