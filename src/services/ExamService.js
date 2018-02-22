import Vue from 'vue'
import * as Vuex from "vuex"
import VueLocalStorage from 'vue-local-storage'
import Axios from 'axios'
import Env from "./Env"
import Util from "./Util"

Vue.use(Vuex, VueLocalStorage)

const EXAM_SERVICE = new Vuex.Store({
	state: {
		intent: null
	},
	mutations: {},
	actions: {
		loadExams({commit}, {self}) {
			if (this.state.intent != null) window.clearInterval(this.state.intent)
			Axios.get(Env.endpoint_exam + "/exam/listExamUser/" + VueLocalStorage.get("AuthStorage").id)
				.then(r => {
					if (r.status === 200) {
						self.loadingTable = false
						self.data = r.data
					}
				})
				.catch(e => {
					self.method = "loadExams"
					Util.fnError(e, self, this)
				})
		},
		loadExam({commit}, {self}) {
			if (this.state.intent != null) window.clearInterval(this.state.intent)
			Axios.get(Env.endpoint_exam + "/exam/takeExam/" + self.exam_id)
				.then(r => {
					if (r.status === 200) {
						self.loadingTable = false
						self.data = r.data
						self.timer()
					}
				})
				.catch(e => {
					self.method = "loadExam"
					Util.fnError(e, self, this)
				})
		},
		loadExamSolution({commit}, {self}) {
			if (this.state.intent != null) window.clearInterval(this.state.intent)
			Axios.get(Env.endpoint_exam + "/exam/seeExamSolution/" + self.params.exam_id)
				.then(r => {
					if (r.status === 200) self.data_exam_solution = r.data
				})
				.catch(e => {
					self.method = "loadExamSolution"
					Util.fnError(e, self, this)
				})
		},
		saveExam({commit}, {self}) {
			Axios.post(Env.endpoint_exam + "/exam/recordExamResponse", self.params)
				.then(r => {
					if (r.status === 200) {
						self.showLoading = false
						self.message = r.data
					}
				})
				.catch(e => {
					self.showLoading = false
					self.message = e.response.data
					Util.fnError(e)
				})
		},
		saveExamUnit({commit}, {self}) {
			Axios.post(Env.endpoint_exam + "/exam/recordExamResponse", self)
				.then(r => {
					if (r.status === 200) {
						//console.log(r)
					}
				})
				.catch(e => Util.fnError(e))
		},
		checkedRequest({commit}, {self}) {
			Axios.put(Env.endpoint_exam + "/exams/listExamsUsers/" + VueLocalStorage.get("AuthStorage").id, {
				params: {
					user_id: u_id,
					exam_id: e_id,
					question_id: q_id,
					answer_id: a_id
				}
			})
				.then(r => {
					if (r.status === 200) self.data_exam = r.data
				})
				.catch(e => Util.fnError(e))
		}
	}
})
export default EXAM_SERVICE