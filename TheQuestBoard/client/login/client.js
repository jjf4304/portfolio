
//React component for the loginform used on the home page/login page
const LoginWindow = (props) =>{
    return(
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            >
                <label htmlFor="username">UserName: </label>
                <input id="user" type="text" name="username" placeholder="username"/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Sign in"/>

            </form>
    );
};

//REact component for the signup form for new users used at the signup page
const SignupWindow = (props) =>{
    return (
        <form id="signupForm" name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">UserName: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Retype Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>

        </form>
    );
};

//Renders the loginwindow component into the login.handlebars at #content
const createLoginWindow = (csrf) =>{
    ReactDOM.render(
        <LoginWindow csrf={csrf}/>,
        document.querySelector("#content")
    );
};

//Renders the signupwindow component into the login.handlebars at #content
const createSignupWindow = (csrf) =>{
    ReactDOM.render(
        <SignupWindow csrf={csrf}/>,
        document.querySelector("#content")
    );
};

//Sets up the buttons that trigger between the components and sets up the error
//modal
const setup = (csrf) =>{
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e)=>{
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e)=>{
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    })

    ReactDOM.render(
        <ErrorModal/>, document.querySelector("#error")   
    );

    createLoginWindow(csrf);
};

const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result)=>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});