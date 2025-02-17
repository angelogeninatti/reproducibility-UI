<script setup>
import { ref, inject } from "vue";

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: true
  }
});

const globalData = inject('globalData');
const isCollapsed = ref(props.collapsed);

const toggleInstructions = async () => {
  if (props.collapsed) {
    isCollapsed.value = !isCollapsed.value;
    await globalData.log_data({
      log: 'instructions_collapse',
      value: isCollapsed.value
    });
  }
};
</script>

<template>
  <div>
    <div class="instruction-container">
      <div class="instruction-box">
        <div v-if="isCollapsed && props.collapsed" class="summary">
          Suppose you are using a search engine (like Google, or Bing) to search for the following query.<br>
          Below are the results provided by the search engine.
          <a href="#" @click.prevent="toggleInstructions">Read full instructions again</a>
        </div>
        <div v-else>
          <h3>Instructions</h3>
          <ul>
            <li>Suppose you are using a search engine (like Google, or Bing) to search information.</li>
            <li>You will be provided a query and its search results. Please browse the list of results.</li>
            <li>By clicking on a result, you can read it fully, and evaluate it.</li>
            <ul>
              <li>Click "Choose" if you think the result is relevant to the provided query.</li>
              <li>Click "Discard" if you think the result is NOT relevant to the provided query.</li>
              <li>Click "Close - No action" if you do not want to evaluate the result.</li>
            </ul>
            <li>You may choose or discard as many results as you want.</li>
            <li>Click on "Continue" when you are satisfied by the results that you have visualized.</li>
            <li>Click on "I don't understand this query, give me another one" to be provided with a different query, if you are unfamiliar with the current one.</li>
          </ul>
          Please note that you cannot go back once you click on "Continue" or "I don't understand this query, give me another one".
          <a v-if="props.collapsed" href="#" @click.prevent="toggleInstructions">Collapse instructions</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instruction-container {
  width: 100%;
  margin: 0 auto;
}
.instruction-box {
  box-sizing: border-box;
  width: 100%;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}
.instruction-box h3 {
  margin-top: 0;
}
.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
a {
  color: #0066cc;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
