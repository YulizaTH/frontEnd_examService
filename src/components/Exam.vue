<template>
    <section>
        <component :is="'nav-exam'"/>
        <div class="card mt-5 mb-5">
            <div class="card-header pb-0">
                <div class="row">
                    <div class="col-3 mb-3">
                        <div class="input-group input-group mt-1">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-dark text-white">Tiempo restante</span>
                            </div>
                            <span class="form-control">{{remaining}}</span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="alert alert-info alert-dismissible fade show" role="alert">
                            <span><b>Nota:&nbsp;&nbsp;</b>Usted esta realizando el examen en estos momentos, favor no refresque el navegador el controlador de refresh se encuentra inabilitado caso contrario los datos seran enviados y no podra nuevamente tomar su examen.</span>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="showAlertFinally"
                             v-if="isHour<=0 && isMinute<=0 && (isMinute==0 ? isSecond<=31 : isSecond!=undefined) && remaining != vtime"
                             class="alert alert-danger" role="alert">
                            <span><b>Advertencia:&nbsp;&nbsp;</b>Su examen terminará en <b>{{remaining}}</b></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table v-if="loadingTable" class="table">
                    <tr>
                        <td colspan="auto" class="text-dark text-center">
                            <div style="padding: 3em 2em 0 2em">
                                <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                <p>Obteniendo Informacion!</p>
                            </div>
                        </td>
                    </tr>
                </table>
                <table v-if="!loadingTable && data.length >= 2" class="table table-vue">
                    <thead>
                    <tr>
                        <th scope="row" colspan="5">
                            <div class="row">
                                <div class="col-1 mt-auto mb-auto">
                                    <span>{{parseInt(Object.keys(data)[next])+1}}.-</span>
                                </div>
                                <div class="col-11 pl-0">
                                    <span class="pl-2" v-html="data[next].name"></span>
                                </div>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="data[next].name_image !== '' ">
                        <td width="100%">
                            <div class="img-thumbnail text-center">
                                <img :src="getImgUrl(data[next].name_image)" alt="">
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(v,k) in data[next].options">
                        <td width="100%" class="pl-5">
                            <b>{{returnLetter(k)}})&nbsp;</b>
                            <div class="form-check form-check-inline">
                                <label class="form-check-label" :for="returnLetter(k)+data[next].id">
                                    <input title="" :data-id="data[next].id" class="form-check-input" type="radio"
                                           :name="'opt'+data[next].id" :id="returnLetter(k)+data[next].id" :value="v.id"
                                           @click="doChecked()"/>
                                    <span>{{v.name}}</span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td width="100%" class="text-center">
                            <div class="row">
                                <div class="col-6 text-right">
                                    <button :hidden="data[next].id == 1" class="btn btn-light" @click="change('-')">
                                        <i class="fa fa-arrow-left fa-fw"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-left">
                                    <button v-if="data.length != next+1" class="btn btn-light" @click="change('+')">
                                        <i class="fa fa-arrow-right fa-fw"></i>
                                    </button>
                                    <a v-else class="btn btn-dark" href data-toggle="modal" data-target="#infoModal_2"
                                       @click.prevent="pauseTimer = true">
                                        <span>Finalizar</span>
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table v-else-if="!loadingTable && data.length <= 1" class="table">
                    <tr>
                        <td colspan="5" class="text-dark text-center">
                            <div style="padding: 3em 2em 0 2em">
                                <i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
                                <p>Usted no cuenta con información disponible!</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- Info Modal-->
        <div class="modal fade in" id="infoModal_2" data-backdrop="static" data-keyboard="false" tabindex="-1"
             role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <span class="text-dark">Atención</span>
                        </h5>
                    </div>
                    <div class="modal-body">
                        <template v-if="!showLoading && message == '' "><p>Esta seguro de terminar <b>{{remaining}}</b>
                        </p></template>
                        <template v-if="!showLoading && message != '' ">{{message}}</template>
                    </div>
                    <div class="modal-footer">
                        <button v-if="!showLoading && message === '' " class="btn btn-secondary" type="button"
                                data-dismiss="modal" @click.prevent="pauseTimer=false;showLoading=false">
                            <i class="fa fa-close fa-fw"></i><span>Cancelar</span>
                        </button>
                        <button v-if="!showLoading && message !== '' " class="btn btn-secondary" type="button"
                                @click="closeModal()">
                            <i class="fa fa-close fa-fw"></i><span>Close</span>
                        </button>
                        <template v-if="!showLoading">
                            <button :hidden="!showLoading && message !== '' "
                                    :disabled="!showLoading && message !== '' " class="btn btn-primary" type="button"
                                    @click.prevent="save()">
                                <template v-if="showLoading"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i><span>Enviando</span>
                                </template>
                                <template v-else><i class="fa fa-check fa-fw"></i><span>Enviar</span></template>
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade in" id="infoModal_3" data-backdrop="static" data-keyboard="false" tabindex="-1"
             role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <span class="text-dark">Atención</span>
                        </h5>
                    </div>
                    <div class="modal-body">
                        <p>El tiempo del examen ah caducado!</p>
                    </div>
                    <div class="modal-footer">
                        <!--<router-link class="btn btn-secondary"   :to="'/exams'"><i class="fa fa-close fa-fw"></i>Cerrar</router-link>-->
                        <button class="btn btn-secondary" type="button" @click="closeModal()"><i
                                class="fa fa-close fa-fw"></i>Cerrar
                        </button>
                        <!--<button class="btn btn-primary" type="button" data-dismiss="modal" @click.prevent="saveExam()">Aceptar</button>-->
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import Nav from '../components/Nav';
    import $ from 'jquery';
    import moment from 'moment';
    import VueLocalStorage from 'vue-local-storage';
    import SERVICE from '../services/ExamService';

    Vue.component("nav-exam", Nav);

    export default {
        data: () => ({
            storage: VueLocalStorage,
            pauseTimer: false,
            loadingTable: true,
            showLoading: false,
            timerStatic: "",
            data: [{}],
            exam_id: 1,
            exam_duration: 0,
            next: 0,
            back: 0,
            vtime: "00:01:00",
            vvtime: 1,
            remaining: this.vtime,
            message: "",
            mitiempo: 20,
            tsecond: 60,
            tminute: 10,
            thour: 1,
            isHour: 0,
            isMinute: 0,
            isSecond: 0,
            selectedValue: "1",
            timerUpdate: null,
            tempRptas: [],
            tempTime: {},
            tempChecked: [],
            tempRptaChecked: [],
        }),
        created() {
            if (this.$route.params.exam_duration != undefined) {
                function disableF5(e) {
                    if ((e.which || e.keyCode) == 116) e.preventDefault();
                };
                $(document).on("keydown", disableF5);
                //Click not refresh page
                window.onbeforeunload = () => {
                    return false;
                };
                this.data = [{}];
                this.exam_id = this.$route.params.theme_id;
                this.vtime = this.toHHMMSS(this.$route.params.exam_duration);
                this.vvtime = this.$route.params.exam_duration;
                this.loadExam();
            } else {
                this.$router.replace("/exams");
            }
        },
        methods: {
            loadExam() {
                SERVICE.dispatch("loadExam", {self: this});
            },
            returnLetter(key, toUpper = false) {
                let letter = ["a", "b", "c", "d", "e", "f", "g", "h"];
                if (toUpper) {
                    return (letter[key]).toString().toUpperCase();
                } else {
                    return letter[key];
                }
            },
            change(signo) {
                if (signo === "+") {
                    //condicional para el temporal checked
                    if (this.tempChecked.length > this.next) {
                        if (this.next + 1 < this.tempChecked.length) {
                            $(document).ready(() => {
                                let inputToArray = $('.table-vue').find('tbody').find('input[type=radio]');
                                $.each(inputToArray, (k, v) => {
                                    //aplicar checked al volver atras
                                    if (this.tempChecked[this.next] != undefined && this.tempChecked[this.next] != {}) {
                                        if (k == this.tempChecked[this.next].checked_id) {
                                            $(v).prop("checked", true);
                                        } else {
                                            $(v).prop("checked", false);
                                        }
                                    } else {
                                        return false;
                                    }
                                });
                            });
                        } else {
                            $(document).ready(() => {
                                let inputToArray = $('.table-vue').find('tbody').find('input[type=radio]');
                                $.each(inputToArray, (k, v) => {
                                    //aplicar checked al iniciar y al dar siguiente
                                    if (this.data.length == this.next) {
                                        if ($(v).is(":checked")) {
                                            $(v).prop("checked", true);
                                        }
                                    } else {
                                        if ($(v).is(":checked")) {
                                            $(v).prop("checked", false);
                                        }
                                    }
                                });
                            });
                        }
                    }

                    //algoritmo logico para avanzar
                    if (this.next + 1 < this.data.length) {
                        this.next = this.next + 1;
                    } else {
                        return false;
                    }

                } else {

                    $(document).ready(() => {
                        let inputToArray = $('.table-vue').find('tbody').find('input[type=radio]');
                        $.each(inputToArray, (kkkk, vvvv) => {
                            //aplicar checked al volver atras
                            //si el contenedor esta definido y solo tiene valores validos
                            if (this.tempChecked[this.next] != undefined && this.tempChecked[this.next] != {}) {
                                //encontrar la posicion del input checked
                                if (kkkk == this.tempChecked[this.next].checked_id) {
                                    $(vvvv).prop("checked", true);
                                } else {
                                    $(vvvv).prop("checked", false);
                                }
                            } else {
                                return false;
                            }
                        });
                    });

                    //algoritmo logico para retroceder
                    if (this.next >= 1) {
                        this.next = this.next - 1;
                    } else {
                        this.next = 0;
                    }

                }

                return this.data[this.next];

            },
            timer() {
                this.remaining = this.vtime;
                const getRemainTime = deadline => {
                    let h = moment(this.remaining, "HH:mm:ss").hour();
                    let m = moment(this.remaining, "HH:mm:ss").minute();
                    let s = moment(this.remaining, "HH:mm:ss").second();
                    this.isHour = h;
                    this.isMinute = m;
                    this.isSecond = s;
                    let now = moment(new Date()),
                        remainTime = (((moment(deadline).add(this.vvtime, 'second') - now) + 1000) / 1000),
                        remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
                        remainMinutes = ('0' + Math.floor(remainTime / 60 % 60)).slice(-2),
                        remainHours = ('0' + Math.floor(remainTime / 3600 % 24)).slice(-2),
                        remainDays = Math.floor(remainTime / (3600 * 24));
                    return {remainTime, remainSeconds, remainMinutes, remainHours, remainDays}
                };
                const countDown = (deadline) => {
                    this.timerUpdate = setInterval(() => {
                        let t = getRemainTime(deadline);
                        if (!this.pauseTimer) {
                            this.remaining = t.remainHours + ':' + t.remainMinutes + ':' + t.remainSeconds;
                        }
                        let $alert = $('#showAlertFinally');
                        if ($alert.hasClass("alert-danger")) {
                            $alert.removeClass("alert-danger");
                            $alert.addClass("alert-warning");
                        } else if ($alert.hasClass("alert-warning")) {
                            $alert.removeClass("alert-warning");
                            $alert.addClass("alert-danger");
                        }
                        if (t.remainTime <= 1) {
                            clearInterval(this.timerUpdate);
                            this.showLoading = true;
                            this.saveExam();
                            this.openModal();
                        }
                    }, 1000);
                };
                countDown(new Date());
            },
            doChecked() {
                $(document).ready(() => {
                    let inputToArray = $('.table-vue').find('tbody').find('input[type=radio]');
                    $.each(inputToArray, (k, v) => {
                        if ($(v).is(":checked")) {
                            //Si la longitud del array es igual al next
                            if (this.tempChecked.length == this.next) {
                                //cargar con valores validos
                                this.tempChecked.push({
                                    user_id: this.storage.get("AuthStorage").id,
                                    exam_id: this.exam_id,
                                    question_id: this.data[this.next].id,
                                    answer_id: $(v).val(),
                                    checked_id: k
                                });
                            } else {
                                //cargar con valores que se volveran a tratar en el siguiente ciclo
                                this.tempChecked[this.next] = {
                                    user_id: this.storage.get("AuthStorage").id,
                                    exam_id: this.exam_id,
                                    question_id: this.data[this.next].id,
                                    answer_id: $(v).val(),
                                    checked_id: k
                                };
                                //recorrer lo cargado, y setear las posiciones con valores invalidos para controlar el arreglo
                                $.each(this.tempChecked, (kk, vv) => {
                                    if (vv == undefined) this.tempChecked[kk] = {};
                                });
                            }
                        }
                    });
                });
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
            saveExam() {
                this.params = [];
                this.params = this.tempChecked;
                SERVICE.dispatch("saveExam", {self: this});
            },
            save() {
                window.clearInterval(this.timerUpdate);
                this.showLoading = true;
                this.saveExam();
            },
            openModal() {
                $('#infoModal_2').modal({backdrop: 'static', keyboard: false, show: true});
            },
            closeModal() {
                $('#infoModal_2').modal('hide');
                $('#infoModal_3').modal('hide');
                this.$router.replace("/exams");
            },
            getImgUrl(pet) {
                return require('@/assets/img/' + pet);
            },
        }
    }

</script>

<style scoped>

</style>