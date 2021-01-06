
//Handles sending the AJAX call for a new post
const handleNewPost = (e) =>{
    e.preventDefault();

    hidePost();


    if($("#postTitle").val() == '' || $("#postDescription").val() == "") {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function(){
        loadPostsFromServer();
    });

    return false;
};

//Currently non functional, waiting for the future
const handleNewReply = (e) =>{
    e.preventDefault();

    $("#errorDiv").animate({left: '-40%'}, 350);
    $("#makePost").animate({left: '150%'}, 350);
    $("#darkLayer").hide(400);

    if($("#replyField").val() == ""){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#postReply").attr("action"), $("#postForm").serialize(), function(){
        displayPost();
    });

    return false;

};

//Handles the AJAX call for changing the users password
const handleChangePass = (e) =>{

    e.preventDefault();
    $("#errorDiv").animate({left: '-40%'}, 350);
    $("#makePost").animate({left: '150%'}, 350);
    $("#fullPost").animate({top: '150%'}, 350);
    $("#darkLayer").hide(400);


    if($("#pass").val() == ''||$("#newPass").val()==''|| $("#newPass2").val()==''){
        handleError("All fields required");
        return false;
    }

    if($("#newPass").val() !== $("#newPass2").val()){

        handleError("New passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

};

//Sets up the form for creating posts
const PostForm = (props) =>{
    return(
        <div>
        <form id="postForm" name="postForm"
            onSubmit={handleNewPost}
            action="/postGame"
            method="POST"
            className="postForm"
        >
            <label htmlFor="postTitle">Name: </label>
            <input id="postTitle" type="text" name="postTitle" placeholder="Post Title"/>
            <label htmlFor="postGame">Game: </label>
            <input id="postGame" type="text" name="postGame" placeholder="What Game are you playing?"/>
            {/* not currently working, having trouble formatting it correctly to be useable? 
            removed all uses of it for now*/}
            {/* <label htmlFor="postDate">When is the game? </label>
            <input id="postDate" type="date" name="postDate" min="2020-01-01" max="2030-01-01"/> */}
            <label htmlFor="postRec">Recurring Game? </label>
            <select id="postRec" type="select" name="postRec">
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            <label htmlFor="postDescription">Quest Description: </label>
            <textarea id="postDescription" rows="5" cols="30" name="postDescription" placeholder="Post Description"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Make post"/>

        </form>
        
        <button id="closePost" onClick={e =>hidePost()}>Close Post</button>

        </div>
        
    );
};

//Sets up the data for viewing the full post
const FullPostData = function(post){
    return(
        <div id="fullData">
            <h2>Game Title:</h2>
            <input type="text" id="fullTitle" value={post.post.title} readOnly/>
            <h2>Quest Giver:</h2>
            <input type="text" id="fullPoster" value={post.post.poster} readOnly/>
            {/* <h2>What Game is being played?</h2>
            <input type="text" id="fullGame" value={post.post.game} readOnly/> */}
            <h2>When is the Game?</h2>
            <input type="date" id="fullDate" value={post.post.dateOfPlay} readOnly/>
            <h2>Is it a recurring game?</h2>
            <input type="text" id="fullRec" value={post.post.recurring} readOnly/>
            <h2>Game Description</h2>
            <textarea id="fullDescription" rows="5" cols="30" defaultValue={post.post.description} readOnly></textarea>
        </div>
    );

};

//Currently non functional, waiting for the future
const FullPostReplyField = (props) =>{
    return(
        <div>
        <form id="postReply" name="postReply"
            onSubmit={handleNewReply}
            action="/postReply"
            method="POST"
            className="postForm"
        >

            <label htmlFor="thePostReply">Reply: </label>
            <textarea id="thePostReply" rows="5" cols="30" name="thePostReply" placeholder="Reply (Coming Soon)"></textarea>
            <input className="formSubmit" type="submit" value="Reply to Post"/>

        </form>

        <button id="closePost" onClick={e =>hidePost()}>Close Post</button>
        </div>
    );
};

//Sets up the change password form
const ChangePassWindow = (props) =>{

    return(
        <div>
            <form id="changePassForm" name="changePassForm"
            onSubmit={handleChangePass}
            action="/changePassword"
            method="POST"
            className="mainForm"
            >
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password"/>
                <label htmlFor="newPass">Enter New Password: </label>
                <input id="newPass" type="password" name="newPass" placeholder="new password"/>
                <label htmlFor="newPass2">Retype New Password: </label>
                <input id="newPass2" type="password" name="newPass2" placeholder="retype new password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Change Password"/>

            </form>

            <button id="closePost" onClick={e =>hidePost()}>Close Post</button>
        </div>

    );
};

//create and setup the button that shows the post maker form
const MakerPageButton = () =>{
    return(
        <div id="makerButtonDiv">
            <button className="uiButton" id="makerButton" onClick={e =>ShowMaker()}>Post a Quest!</button>
        </div>
    );
};

//create and setup the button that shows the change password form
const SetupChangePassButton = () =>{
    return(
        <div id="makerButtonDiv">
            <button className="uiButton" id="changePassButton" onClick ={e =>ShowChangePass()}>Change Password</button>
        </div>
    );
};

//set up the content of the questboard through all of the posts
const PostList = function(props){
    if(props.posts.length === 0){
        //Change this to the image with No Groups Available when finished
        return(
            <div className="postList">
                <h3>No Group Postings Yet Adventurer</h3>
            </div>
        );
    }

    const postNodes = props.posts.map(function(post){
        return(
            <div className="postNode" key={post._id} onClick={e =>displayPost(post)}>
                <h2>{post.title}</h2>
                <h4>Posted by {post.poster}</h4>
            </div> 
        );
    });

    return(
        <div className="posts">
            {postNodes}
        </div>
    )
};

////Currently non functional, waiting for the future
const AllReplies = (post) =>{
    const replies = post.post.map(function(replies){
        return(
            <div className = "gameReply" key={replies.poster}>
                <h3>{replies.poster}</h3>
                <p>{replies.reply}</p>
            </div>
        );
    });

    return(
        <div className="allReplies">
            {replies}
        </div>
    );
};

//Displays the full post modal and React sets its values
function displayPost(post){

    
    $("#fullPost").animate({top:'20%'}, 350);

    ReactDOM.render(
        <FullPostData post={post}/>, document.querySelector("#fullDetails")
    );

    ReactDOM.render(
        <FullPostReplyField/>, document.querySelector("#fullReplyField")  
    );

    // ReactDOM.render(
    //     <AllReplies post={post}/>, document.querySelector("#fullReplies")
    // );
}

//Ajax call for getting game posts and rendering them to the questboard
const loadPostsFromServer = () =>{
    sendAjax('GET', '/getGamePosts', null, (data)=>{
        ReactDOM.render(
            <PostList posts = {data.posts}/>, document.querySelector("#questBoard")
        );
    });
};

//animate and show the maker form
const ShowMaker = () =>{
    $("#makePost").animate({left: '30%'}, 350);
    $("#darkLayer").show(400);

};

//animate and show the change password form
const ShowChangePass = () =>{
    console.log("IN CHANGE PASS SHOW");
    $("#changePassDiv").animate({left: '30%'}, 350);
    $("#darkLayer").show(400);
};

//Setup the initial REact values
const setup = function(csrf){
    ReactDOM.render(
        <PostForm csrf={csrf}/>, document.querySelector("#makePost")
    );

    ReactDOM.render(
        <PostList posts ={[]}/>,document.querySelector("#questBoard")
    );

    ReactDOM.render(
        <MakerPageButton/>, document.querySelector("#makerButton")
    );

    ReactDOM.render(
        <SetupChangePassButton/>, document.querySelector("#changePassButton")
    );

    ReactDOM.render(
        <ErrorModal/>, document.querySelector("#error")   
    );

    ReactDOM.render(
        <ChangePassWindow csrf={csrf}/>, document.querySelector("#changePassDiv")  
    );

    loadPostsFromServer();
};


const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});