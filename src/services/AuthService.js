/**
 * Created by aquispe on 01/02/2018.
 **/

import Vue from 'vue'
import * as Vuex from "vuex"
import VueLocalStorage from 'vue-local-storage'
import Axios from 'axios'
import Env from "./Env"
import Util from "./Util"

Vue.use(Vuex, VueLocalStorage)

const AUTH_SERVICE = new Vuex.Store({
	actions: {
		doLogin({commit}, {self}) {
			VueLocalStorage.set("AuthStorage", undefined)
			self.validate = null
			self.errors = ""
			if (self.params.username === '') return self.errors = "El campo username no puede estar vacio!"
			if (self.params.password === '') return self.errors = "El campo password no puede estar vacio!"

			Axios.post(Env.endpoint_auth + "/api/authenticate/examenes", self.params)
				.then( r => {
					if (r.status === 200) {
						
						if (r.data.status === false) {
							self.errors = "Credenciales Invalidas...!!"
						} else {							
							VueLocalStorage.set("AuthStorage", r.data.data)							
							this.dispatch("validateIfExist", { self: { self: self, auth_user: r.data.data } })
						}					
					}
				})
				.catch(e => Util.fnError(e))
		},

		doLogout({commit}, {self}) {
			VueLocalStorage.set("AuthStorage", undefined)
			doAuth(self)
		},

		loadProjects({commit}, {self}) {
			Axios.get(Env.endpoint_exam + "/proyect/state/1")
				.then( r => {
					if (r.status === 200) {
						self.params.selectedProject = r.data[0].id
						self.data = r.data
					}
				})
				.catch(e => Util.fnError(e))
		},

		validateIfExist({commit}, {self}) {
			Axios.post(Env.endpoint_exam + "/user/validateIfExist", self.auth_user)
				.then( r => {
					if (r.status === 200) {
						//validar hacia donde navegar o listar proyectos o listar examenes
						VueLocalStorage.set("AuthStorage", r.data[0])
						if(r.data[0].proyect_id.id === 1) self.self.$router.replace("/project")
						else self.self.$router.replace("/exams")
					}
					
					if (r.status === 201) {
						VueLocalStorage.set("AuthStorage",r.data[0])
						self.self.$router.replace("/project")
					}
				})
				.catch(e => Util.fnError(e))
		},

		updateProject({commit}, {self}){
			Axios.patch(Env.endpoint_exam + "/user/updateProyect/" + VueLocalStorage.get("AuthStorage").id, {proyect_id:self.params.selectedProject})
				.then( r => {
					if (r.status === 204) {
						let objAuth = VueLocalStorage.get("AuthStorage")
						objAuth.proyect_id.id = self.params.obj.id
						objAuth.proyect_id.name = self.params.obj.name
						VueLocalStorage.set("AuthStorage", objAuth)
						self.$router.replace("/exams")
					}
				})
				.catch(e => Util.fnError(e))
		}
	}
})

function doAuth(self) {
	if (VueLocalStorage.get("AuthStorage") != undefined) self.$router.replace('/project')
	else self.$router.replace('/login')
}

export default AUTH_SERVICE