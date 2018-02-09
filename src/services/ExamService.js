import Vue from 'vue';
import * as Vuex from "vuex";
import VueLocalStorage from 'vue-local-storage';
import Axios from 'axios';
import ENV from "./ENV";
import Util from "./Util";
import $ from 'jquery';

Vue.use(Vuex, VueLocalStorage);
Axios.defaults.headers.common['X-Sapia-Api-Vue-Salis'] = 'XMLHttpRequest';
Axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded,application/json';

const EXAM_SERVICE = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {
        loadExams({commit}, {self}) {
            Axios.get(ENV.API + "/exams/listExamsUsers/" + VueLocalStorage.get("auth").id)
                .then((r) => {
                    if (r.status === 200) {
                        self.data = r.data;
                        $.extend(self.data[2],{id:1});
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        loadExam({commit}, {self}){
            Axios.get(ENV.API + "/exams/takeExam/"+ self.theme_id)
                .then((r) => {
                    if (r.status === 200) {
                        self.data = r.data;
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        loadExamsSolution({commit}, {self}){
            Axios.get(ENV.API + "/exams/seeExamSolution/1")
                .then((r) => {
                    if (r.status === 200) {
                        self.data_exam_solution = r.data;
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        saveExam({commit}, {self}){
            Axios.post(ENV.API + "/exams/recordResponseExam",{params:self.params.rptas})
                .then((r) => {
                    if (r.status === 200) {
                        console.log(r)
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        checkedRequest({commit}, {self}){
            Axios.put(ENV.API + "/exams/listExamsUsers/" + VueLocalStorage.get("auth").id,{params:{user_id:u_id,exam_id:e_id,question_id:q_id,answer_id:a_id}})
                .then((r) => {
                    if (r.status === 200) {
                        self.data_exam = r.data;
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        }
    }
});
export default EXAM_SERVICE;