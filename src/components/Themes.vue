<template>
    <section>
        <component :is="'nav-exam'"/>
        <div class="card mt-5 mb-5">
            <div class="card-header bg-dark text-white">
                <b class="h5">Tus Temarios</b>
                <div hidden class="form-inline">
                    <label>
                        <select class="form-control">
                            <option value="" selected disabled>Type Exam</option>
                            <option value="user">Pending</option>
                            <option value="backoffice">Finished</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha Inicio</th>
                            <th scope="col">Fecha Fin</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Duración</th>
                            <th scope="col">Nota</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody v-if="data.length">
                            <tr v-for="(v,k) in data">
                            <th scope="row">{{k+1}}</th>
                            <td>{{v.name}}</td>
                            <td>{{moment(v.start_date).format("DD-MM-YYYY")}}</td>
                            <td>{{moment(v.expiration_date).format("DD-MM-YYYY")}}</td>
                            <td>
                                <span v-if="v.exam_state_id == 1" class="text-primary"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id == 2" class="text-warning"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id == 3" class="text-success"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id == 4" class="text-danger"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id == 5" class="text-dark"><b>{{v.exam_state}}</b></span>
                            </td>
                            <td>{{moment(700/86400).format("HH:mm:ss")}}</td>
                            <td>
                                <span v-if="v.exam_state_id == 1">{{v.note}}</span>
                                <span v-if="v.exam_state_id == 2">{{v.note}}</span>
                                <span v-if="v.exam_state_id == 3">{{v.note}}</span>
                                <span v-if="v.exam_state_id == 4">{{v.note}}</span>
                                <span v-if="v.exam_state_id == 5">{{v.note}}</span>
                            </td>
                            <td>
                                <a v-if="v.exam_state_id == 3" class="btn btn-primary" href @click.prevent="openModal(2)">
                                    <i class="fa fa-file-text-o fa-fw"></i>
                                    <span>Ver Solución</span>
                                </a>
                                <a v-if="v.exam_state_id == 2" class="btn btn-warning" href data-toggle="modal" data-target="#infoModal" @click.prevent="p_theme_id = v.id">
                                    <i class="fa fa-file-text-o fa-fw"></i>
                                    <span>Iniciar Examen</span>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-else>
                        <tr>
                            <td colspan="8" class="text-dark text-center">
                                <div style="padding: 3em 2em 0 2em">
                                    <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                    <p>Obteniendo Informacion!</p>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- Info Modal-->
        <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span class="text-danger">Are you ready to start the exam?</span>
                        </h5>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">The exam lasts 10 minutes with no option to cancel.</div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                        <router-link data-dismiss="modal" class="btn btn-primary" :to="{name:'exam',params:{theme_id:p_theme_id}}">Ready</router-link>
                    </div>
                </div>
            </div>
        </div>
        <!-- Exam Solution Modal-->
        <div id="modal-id-exam-solucion" class="modal fade in" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div v-if="loadComponentExamSolution">
                        <div class="modal-header">
                            <h5 class="modal-title">Solucion de Examen</h5>
                        </div>
                        <div class="modal-body">
                            <div class="card mt-0 mb-0">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-2 mt-3 mb-3">
                                            <div class="input-group input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">Nota</span>
                                                </div>
                                                <span class="form-control">18</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <div v-for="(v,k) in data_exam_solution">
                                            <table class="table table-vue">
                                                <thead>
                                                <tr>
                                                    <th scope="row" colspan="5"><span>{{k+1}}.-</span>&nbsp;&nbsp;{{v.name}}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr v-for="(vv,kk) in v.options">
                                                    <td width="25%" :class="vv.id == v.answer_correct ? 'pl-5 bg-success text-white': vv.id == v.answer_register ? 'pl-5 bg-danger text-white' : 'pl-5'" >
                                                        <b>{{returnLetter(kk)}})&nbsp;</b>
                                                        <div class="form-check form-check-inline">
                                                            <!--<input :data-id="v.id" class="form-check-input" type="radio" :name="'opt'+v.id" :id="returnLetter(kk)+v.id" :value="vv.id" @click="doChecked()"/>-->
                                                            <label class="form-check-label" :for="returnLetter(kk)+v.id">{{vv.name}}</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal(2)"><i class="fa fa-close fa-fw"></i>Close</button>
                        </div>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import Nav from '../components/Nav';
    import moment from 'moment';
    import SERVICE from '../services/ExamService';
    import $ from 'jquery';

    Vue.component("nav-exam", Nav);

    export default {
        data: () => ({
            data: [],
            data_exam_solution: [],
            moment:moment,
            p_theme_id:null,
            loadComponentExamSolution: false,
        }),
        created() {
            this.loadThemes();
        },
        methods: {
            loadThemes() {
                return SERVICE.dispatch("loadExams", {self: this});
            },
            openModal(num) {
                if (num == 1) {
                    this.timer();
                    this.loadComponentExam = true;
                    $('#modal-id-exam').modal({backdrop: 'static', keyboard: false, show: true});
                    this.loadExam();
                } else {
                    this.loadComponentExamSolution = true;
                    $('#modal-id-exam-solucion').modal({keyboard: false, show: true});
                    this.loadExamsSolution();
                }
            },
            closeModal(num) {
                if (num == 1) {
                    this.deadInterval();
                    $('#infoModal').modal('hide');
                    this.loadComponentExam = false;
                    $('#modal-id-exam').modal('hide');
                } else {
                    this.loadComponentExamSolution = false;
                    $('#modal-id-exam-solucion').modal('hide');
                }
            },
            returnLetter(key, toUpper = false) {
                let letter = ["a", "b", "c", "d", "e", "f", "g", "h"];
                if (toUpper) {
                    return (letter[key]).toString().toUpperCase();
                } else {
                    return letter[key];
                }
            },
            loadExamsSolution() {
                SERVICE.dispatch("loadExamsSolution", {self: this});
            }
        },
    }
</script>

<style scoped>

</style>