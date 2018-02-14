<template>
    <section>
        <div class="card card-login mx-auto mt-5">
            <div class="card-header">
                <b class="h5">Select</b>
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label>Project</label>
                        <select v-model="params.selectedProject" class="form-control mb-1">
                            <option v-for="(v,k) in data" :value="v.id">{{v.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <span v-if="params.selectedProject == '1' ">
                            <a href class="btn btn-primary btn-block disabled"><span>Siguiente</span></a>
                        </span>
                        <span v-else>
                            <button type="button" :class=" params.selectedProject != '1' ? 'btn btn-primary btn-block' : 'btn btn-primary btn-block disabled' " @click="updateProject()">Siguiente</button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
    import SERVICE from '../services/AuthService';

    export default {
        name: "select-project",
        data: () => ({
            data: [],
            params:{
                selectedProject:'1',
                obj:{},
            }
        }),
        created() {
            this.loadProjects();
        },
        methods: {
            loadProjects() {
                SERVICE.dispatch("loadProjects", {self: this});
            },
            updateProject(){
                this.params.obj = this.data[this.params.selectedProject-1];
                SERVICE.dispatch("updateProject", {self: this});
            }
        }
    }
</script>

<style scoped>

</style>