/**
 * Created by aquispe on 01/02/2018.
 **/

import Vue from 'vue';
import * as Vuex from "vuex";
import VueLocalStorage from 'vue-local-storage';
import Axios from 'axios';
import ENV from "./ENV";
import Util from "./Util";

Vue.use(Vuex, VueLocalStorage);

const AUTH_SERVICE = new Vuex.Store({
    actions: {
        doLogin({commit}, {self}) {
            VueLocalStorage.set("AuthStorage", undefined);
            self.errors.username = "";
            self.errors.password = "";
            self.errors.login = "";
            self.validate = null;
            if (self.params.username === '') {
                return self.errors.username = "El campo username no puede estar vacio!";
            }
            if (self.params.password === '') {
                return self.errors.password = "El campo password no puede estar vacio!";
            }

            Axios.post(ENV.API + "/user/authentication", self.params)
                .then((r) => {
                    if (r.status === 200) {
                        VueLocalStorage.set("AuthStorage", r.data.data);
                        this.dispatch("validateIfExist",{self:{self:self,auth_user:r.data.data}});
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        doLogout({commit}, {self}) {
            VueLocalStorage.set("AuthStorage", undefined);
            doAuth(self);
        },
        loadProjects({commit}, {self}) {
            Axios.get(ENV.API + "/proyect/state/1")
                .then((r) => {
                    // console.log(r.data);
                    if (r.status === 200) {
                        self.params.selectedProject = r.data[0].id;
                        self.data = r.data;
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        },
        validateIfExist({commit}, {self}) {
            Axios.post(ENV.API + "/user/validateIfExist", self.auth_user)
                .then((r) => {
                    if (r.status === 200) {
                        //validar hacia donde navegar o listar proyectos o listar examenes
                        console.log("User exist");
                        VueLocalStorage.set("AuthStorage",r.data[0]);
                        self.self.$router.replace("/exams");
                    }

                    if (r.status === 201) {
                        console.log("User create");
                        VueLocalStorage.set("AuthStorage",r.data);
                        self.self.$router.replace("/project");
                    }
                })
                .catch((e) => Util.fnError(e))
        },
        updateProject({commit}, {self}){
            Axios.patch(ENV.API + "/user/updateProyect/"+VueLocalStorage.get("AuthStorage").id,{proyect_id:self.params.selectedProject})
                .then((r) => {
                    if (r.status === 204) {
                        self.$router.replace("/exams");
                    }
                })
                .catch((e) => {
                    Util.fnError(e);
                });
        }
    }
});
function doAuth(self) {
    if (VueLocalStorage.get("AuthStorage") != undefined) {
        self.$router.replace('/project');
    } else {
        self.$router.replace('/login');
    }
}

export default AUTH_SERVICE;