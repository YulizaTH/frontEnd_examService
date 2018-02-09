<template>
    <section>
        <div class="card mt-0 mb-0">
            <div class="card-header">
                <div class="row">
                    <div class="col-4 mt-3 mb-3">
                        <div class="input-group input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-primary text-white">Nota</span>
                            </div>
                            <span class="form-control">18</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <div v-for="(v,k) in data_exam">
                        <table class="table table-vue">
                            <thead>
                            <tr>
                                <th scope="row" colspan="5"><span>{{k+1}}.-</span>&nbsp;&nbsp;{{v.name}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(vv,kk) in v.options">
                                <td width="25%" class="pl-5">
                                    <b>{{returnLetter(kk)}})&nbsp;</b>
                                    <div class="form-check form-check-inline">
                                        <input :data-id="v.id" class="form-check-input" type="radio" :name="'opt'+v.id" :id="returnLetter(kk)+v.id" :value="vv.id" @click="doChecked()"/>
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
    </section>
</template>

<script>
    export default {
        name: "exam-solution",
        data:()=>({

        }),
        created(){

        },
        methods:{

        }
    }
</script>

<style scoped>

</style>