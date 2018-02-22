<template>
    <section>
        <component :is="'nav-exam'"/>
        <div class="card mt-4 mb-4">
            <div class="card-header bg-dark text-white">
                <span><i @click="loadThemes()" class="fa fa-refresh text-warning"
                         title="Recargar lista de examanes"></i></span>
                <b class="h5">&nbsp Mis Examenes</b>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                        <tr align="center">
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha Inicio</th>
                            <th scope="col">Fecha Fin</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Duración</th>
                            <th scope="col">Nota</th>
                            <th scope="col">Accion</th>
                        </tr>
                        </thead>
                        <tbody v-if="loadingTable" class="table">
                        <tr>
                            <td colspan="8" class="text-dark text-center">
                                <div style="padding: 3em 2em 0 2em">
                                    <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                    <p>Obteniendo Informacion!</p>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-if="!loadingTable && data.length > 1">
                        <tr v-for="(v,k) in data">
                            <th align="center" scope="row">{{k+1}}</th>
                            <td>{{v.name}}</td>
                            <td align="center">{{moment(v.start_date).format("MMMM D, hh:mm a")}}</td>
                            <td align="center">{{moment(v.expiration_date).format("MMMM D, hh:mm a")}}</td>
                            <td align="center">
                                <span v-if="v.exam_state_id === 1" class="text-primary"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id === 2" class="text-warning"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id === 3" class="text-success"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id === 4" class="text-danger"><b>{{v.exam_state}}</b></span>
                                <span v-if="v.exam_state_id === 5" class="text-dark"><b>{{v.exam_state}}</b></span>
                            </td>
                            <td align="center">{{toFormatHours(v.duration)}}</td>
                            <td align="center">{{v.note}}</td>
                            <td align="center">

                                <template v-if="v.exam_state_id === 3">
                                    <a class="btn btn-primary" href @click.prevent="openModal(v)">
                                        <i class="fa fa-file-text-o fa-fw"></i> <span>Mirar Solución</span>
                                    </a>
                                </template>

                                <template v-if="v.exam_state_id === 2">
                                    <a class="btn btn-warning" href data-toggle="modal" data-target="#infoModal"
                                       @click.prevent="p_theme_id = v.exam_id; p_exam_duration = v.duration">
                                        <i class="fa fa-file-text-o fa-fw"></i> <span>Iniciar Examen</span>
                                    </a>
                                </template>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-else-if="!loadingTable && data.length <= 0">
                        <tr>
                            <td colspan="8" class="text-dark text-center">
                                <div style="padding: 3em 2em 0 2em">
                                    <i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
                                    <p>Usted no cuenta con información disponible!</p>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Info Modal-->
        <div class="modal fade in" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span class="text-dark">¿Estás listo para iniciar el examen?</span>
                        </h5>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        El examen tiene un tiempo de <b>{{toHHMMSS(p_exam_duration)}}</b>, sin opciones de regresar,
                        cancelar o actualizar la página; porfavor prevee el tiempo necesario ya que solo contarás con 01
                        intento para rendir el examen.
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                        <button data-dismiss="modal" class="btn btn-primary" @click.prevent="updateStatusExam()">
                            Aceptar
                        </button>
                        <!--<router-link data-dismiss="modal" class="btn btn-primary" :to="{name:'exam',params:{theme_id:p_theme_id,exam_duration:p_exam_duration}}">-->
                        <!--<span>Aceptar</span>-->
                        <!--</router-link>-->
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
                                                <span class="form-control">{{modal.note}}</span>
                                            </div>
                                        </div>
                                        <div class="col-10 mt-3 mb-3">
                                            <div class="row">
                                                <div class="col-4">
                                                    <div class="input-group input-group">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text">Rpta Correcta</span>
                                                        </div>
                                                        <span class="form-control text-center"><i
                                                                class="fa fa-check text-success"></i></span>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="input-group input-group">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text">Rpta Incorrecta</span>
                                                        </div>
                                                        <span class="form-control text-center"><i
                                                                class="fa fa-close text-danger"></i></span>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="input-group input-group">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text">Rpta vacia</span>
                                                        </div>
                                                        <span class="form-control text-center"><i
                                                                class="fa fa-exclamation-triangle text-warning"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div v-if="loadingTable" class="text-center">
                                        <table class="table">
                                            <tr>
                                                <td class="text-dark text-center">
                                                    <div style="padding: 3em 2em 0 2em">
                                                        <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                                        <p>Obteniendo Informacion!</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div v-if="!loadingTable && data_exam_solution.length >= 1"
                                         v-for="(v,k) in data_exam_solution">
                                        <table class="table table-vue">
                                            <thead>
                                            <tr>
                                                <th scope="row" colspan="5"><span>{{k+1}}.-</span>&nbsp;&nbsp;{{v.name}}
                                                    <i v-if="v.answer_register == '0' " title="Pregunta sin Rpta!"
                                                       class="fa fa-exclamation-triangle text-warning"></i></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(vv,kk) in v.options">
                                                <td width="90%">
                                                    <b>{{returnLetter(kk)}})&nbsp;</b>
                                                    <div class="form-check form-check-inline">
                                                        <label class="form-check-label" :for="returnLetter(kk)+v.id">{{vv.name}}</label>
                                                    </div>
                                                </td>
                                                <td width="10%" class="text-right">
                                                    <template v-if="v.answer_correct == v.answer_register">
                                                        <i v-if="vv.id == v.answer_correct"
                                                           class="fa fa-check text-success"
                                                           title="Este es la rpta correcta."></i>
                                                    </template>
                                                    <template v-else>
                                                        <i v-if="vv.id == v.answer_correct"
                                                           class="fa fa-check text-success"
                                                           title="Este es la rpta correcta."></i>
                                                        <i v-if="vv.id == v.answer_register"
                                                           class="fa fa-close text-danger"
                                                           title="Este es la rpta que marcaste"></i>
                                                    </template>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br>
                                    </div>
                                    <div v-if="!loadingTable && data_exam_solution.length <= 0" class="text-center">
                                        <table class="table">
                                            <tr>
                                                <td class="text-dark text-center">
                                                    <div style="padding: 3em 2em 0 2em">
                                                        <i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
                                                        <p>Información no disponible!</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal(2)">
                                <i class="fa fa-close fa-fw"></i>
                                <span>Cerrar</span>
                            </button>
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
    import VueLocalStorage from 'vue-local-storage';

    moment.locale("es");
    Vue.component("nav-exam", Nav);
    export default {
        data: () => ({
            storage: VueLocalStorage,
            loadingTable: true,
            data: [],
            data_exam_solution: [],
            moment: moment,
            p_theme_id: null,
            p_exam_duration: 0,
            loadComponentExamSolution: false,
            params: {
                exam_id: 0,
                user_id: "",
                exam_state_id: 3,
            },
            modal: {
                note: 0,
            },
        }),
        created() {
            this.loadThemes();
        },
        methods: {
            loadThemes() {
                this.loadingTable = true
                return SERVICE.dispatch("loadExams", {self: this});
            },
            openModal(object) {
                this.loadComponentExamSolution = true;
                this.params.exam_id = object.exam_id;
                this.modal.note = object.note;
                $('#modal-id-exam-solucion').modal({keyboard: false, show: true});
                this.loadExamSolution();
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
            loadExamSolution() {
                SERVICE.dispatch("loadExamSolution", {self: this});
            },
            toFormatHours(seg) {
                const timeBox = {seg: seg, min: '', hrs: ''};
                let result = '';
                const extractQuotientResidue = (limit, valor) => {
                    if (timeBox['seg'] >= limit) {
                        timeBox[valor] = (timeBox['seg'] / limit).toString().split('.')[0];
                        timeBox['seg'] = timeBox['seg'] - (timeBox[valor] * limit)
                    }
                };
                extractQuotientResidue(3600, 'hrs');   // Extrayendo el cociente para las horas
                extractQuotientResidue(60, 'min');     // Extrayendo el cociente para las minutos
                result = (timeBox.hrs) ? result.concat(timeBox.hrs, 'hrs ') : result.concat('');
                result = (timeBox.min) ? result.concat(timeBox.min, 'min ') : result.concat('');
                result = (timeBox.seg) ? result.concat(timeBox.seg, 'seg ') : result.concat('');
                return result
            },
            toHHMMSS(sec) {
                let sec_num = parseInt(sec, 10), // don't forget the second param
                    hh = Math.floor(sec_num / 3600),
                    mm = Math.floor((sec_num - (hh * 3600)) / 60),
                    ss = sec_num - (hh * 3600) - (mm * 60);
                if (hh < 10) hh = "0" + hh;
                if (mm < 10) mm = "0" + mm;
                if (ss < 10) ss = "0" + ss;
                return hh + ':' + mm + ':' + ss;
            },
            updateStatusExam() {
                this.params.exam_id = this.p_theme_id;
                this.params.user_id = this.storage.get("AuthStorage").id;
                this.params.exam_state_id = 3;
                SERVICE.dispatch("updateStatusExam", {self: this});
            }
        },
    }

</script>

<style scoped>

</style>