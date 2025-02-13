import './assets/main.css'

import {createApp, ref} from 'vue'
import App from './App.vue'
import axios from "axios";

const app = createApp(App);
const globalData = {
    NUM_PAGES: 8,
    NUM_EXP_PHASES: 2,
    TOTAL_NUM_SCENES: 14,
    current_scene: ref(0),
    get_docs_url: 'https://ir.ontomap.eu/get-docs',
    logs_url: 'https://ir.ontomap.eu/reproducibility-log/',
    create_user_url: 'https://ir.ontomap.eu/create-reproducibility-user/',
    requestQueue: [],
    isProcessing: false,
    assigned_exp_condition: -1,
    preloaded_query: null,

    log_data: async function (data) {
        let enriched_data = {
            ...data,
            user_id: sessionStorage.getItem("uuid"),
            exp_step: window.step
        };

        // Add the request to the queue
        this.requestQueue.push(enriched_data);

        // If no request is currently being processed, start processing the queue
        if (!this.isProcessing) {
            await this.processQueue();
        }
    },

    processQueue: async function () {
        this.isProcessing = true;

        // Process requests from the queue one by one
        while (this.requestQueue.length > 0) {
            const data = this.requestQueue.shift();
            try {
                await axios.post(this.logs_url, data);
            } catch (error) {
                console.error('Error logging data:', error);
            }
        }

        this.isProcessing = false;
    },

    parseParams: function (params) {
        const keys = Object.keys(params)
        let options = ''

        keys.forEach((key) => {
            const isParamTypeObject = typeof params[key] === 'object'
            const isParamTypeArray = isParamTypeObject && params[key].length >= 0

            if (!isParamTypeObject) {
                options += `${key}=${params[key]}&`
            }

            if (isParamTypeObject && isParamTypeArray) {
                params[key].forEach((element) => {
                    options += `${key}=${element}&`
                })
            }
        })

        return options ? options.slice(0, -1) : options
    },

    load_next_query: async function (already_chosen, callback) {
        if (this.preloaded_query !== null) {
            callback(this.preloaded_query)
            this.preloaded_query = null
        } else {
            await axios.get(globalData.get_docs_url, {
                params: {
                    user_id: sessionStorage.getItem("uuid"),
                    already_selected: already_chosen.value.map(el => el.query_id),
                },
                paramsSerializer: (params) => this.parseParams(params),
            }).then(async res => {
                if(callback === null)
                    this.preloaded_query = res
                else
                    callback(res)
            })
        }
    }
};
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('prolificID');
if (prolificID === null || !prolificID || prolificID === "") {
    sessionStorage.setItem("uuid", "INVITED-" + self.crypto.randomUUID())
} else
    sessionStorage.setItem("uuid", prolificID)
await axios.get(globalData.create_user_url + "?uuid=" + sessionStorage.getItem("uuid") + "&assigned_condition=" + urlParams.get('assigned_condition')).then(response => {
    globalData.assigned_exp_condition = response.data;
    globalData.log_data({
        log: "user_created",
        user_id: sessionStorage.getItem("uuid"),
        exp_condition: globalData.assigned_exp_condition
    });
})
app.provide('globalData', globalData);
app.mount('#app');
