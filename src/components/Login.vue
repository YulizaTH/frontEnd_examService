<template>
    <section>
        <div class="card card-login mx-auto mt-5">
            <div class="card-header">
                <b class="h5">Sign In</b>
            </div>
            <div class="card-body">
                <form @submit.prevent="doLogin()" >
                    <div class="form-group">
                        <label>Email</label>
                        <div class="input-group mb-1">
                            <input v-model="params.username" name="email" class="form-control" type="text" placeholder="Enter email" title="Registrar" value="" >
                            <div class="input-group-append"><span class="input-group-text">@sapia.com.pe</span></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="params.password" name="password" class="form-control mb-1" type="password" placeholder="Password" >
                    </div>

                    <div v-if="errors !== '' " class="alert alert-danger" role="alert">
                        <span class="fa fa-exclamation-triangle"> &nbsp{{errors}}</span>
                    </div>

                    <div class="form-group">
                        <div class="form-check">
                            <label class="form-check-label"><input name="rememberme" class="form-check-input" type="checkbox">Remember Password</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" >Log In</button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
    import SERVICE from '../services/AuthService';

    export default {
        name: "login",
        data: () => ({
            loading: false,
            validate: null,
            data: [],
            params: {
                username: "",
                password: ""
            },
            errors: ""
        }),
        methods: {
            doLogin() {
                SERVICE.dispatch("doLogin", {self: this});
            },

        }
    }
</script>

<style scoped>

</style>