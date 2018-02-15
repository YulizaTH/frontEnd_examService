<template>
    <section>
        <div class="card card-login mx-auto mt-5">
            <div class="card-header">
                <b class="h5">Sign In</b>
            </div>
            <div class="card-body">
                <form @submit.prevent="doLogin()">
                    <div class="form-group">
                        <label>Email</label>
                        <div class="input-group mb-1">
                            <input v-model="params.username" name="email" class="form-control" type="text" placeholder="Enter email" title="Registrar" value="" required>
                            <div class="input-group-append">
                                <span class="input-group-text">@sapia.com.pe</span>
                            </div>
                        </div>
                        <span v-if="errors.username !== '' " class="help-block"><small><strong>{{errors.username}}</strong></small></span>
                        <span v-if="errors.login" class="help-block"><small><strong>{{errors.login}}</strong></small></span>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="params.password" name="password" class="form-control mb-1" type="password" placeholder="Password" required>
                        <span v-if="errors.password !== '' " class="help-block"><small><strong>{{errors.password}}</strong></small></span>
                    </div>
                    <div class="form-group">
                        <div class="form-check">
                            <label class="form-check-label"><input name="rememberme" class="form-check-input" type="checkbox">Remember Password</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" >Log In</button>
                </form>
                <div hidden>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div class="text-left text-nowrap">
                                <a class="small" href="">Register an Account</a>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="text-right text-nowrap">
                                <a class="small" href="">Forgot Password?</a>
                            </div>
                        </div>
                    </div>
                </div>
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
                username: "jcornejo",
                password: "72482060"
            },
            errors: {
                username: "",
                password: "",
                login: ""
            }
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